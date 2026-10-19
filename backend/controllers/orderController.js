const pool = require("../config/db");

function formatOrder(order, items = []) {
  return {
    id: order.id,
    branchId: order.branch_id,
    branchName: order.branch_name || null,
    customerName: order.customer_name || "Customer",
    phone: order.customer_phone || "",
    type: order.order_type === "dine_in" ? "dine-in" : order.order_type,
    tableNumber: order.table_number || null,
    subtotal: Number(order.subtotal),
    vatAmount: Number(order.vat_amount),
    total: Number(order.total),
    status: order.status,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    items: items,
  };
}

// GET /api/orders
async function getOrders(req, res) {
  const { branchId } = req.query;

  try {
    let orderQuery = `
      SELECT
        o.id,
        o.branch_id,
        b.name AS branch_name,
        o.customer_name,
        o.customer_phone,
        o.order_type,
        o.table_number,
        o.subtotal,
        o.vat_amount,
        o.total,
        o.status,
        o.created_at,
        o.updated_at
      FROM orders o
      JOIN branches b ON o.branch_id = b.id
    `;
    const params = [];

    if (branchId) {
      orderQuery += " WHERE o.branch_id = ?";
      params.push(Number(branchId));
    }

    orderQuery += " ORDER BY o.id DESC";

    const [orders] = await pool.query(orderQuery, params);

    if (orders.length === 0) {
      return res.json([]);
    }

    const orderIds = orders.map((o) => o.id);

    // Fetch all items for these orders
    const [items] = await pool.query(
      `SELECT
        oi.id,
        oi.order_id,
        oi.product_id,
        p.name AS product_name,
        oi.quantity,
        oi.unit_price,
        oi.line_total
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id IN (?)
      ORDER BY oi.id ASC`,
      [orderIds]
    );

    const itemsByOrder = {};
    for (const item of items) {
      if (!itemsByOrder[item.order_id]) {
        itemsByOrder[item.order_id] = [];
      }
      itemsByOrder[item.order_id].push({
        id: item.id,
        productId: item.product_id,
        productName: item.product_name || `Item #${item.product_id}`,
        price: Number(item.unit_price),
        quantity: item.quantity,
        lineTotal: Number(item.line_total),
      });
    }

    const formattedOrders = orders.map((o) =>
      formatOrder(o, itemsByOrder[o.id] || [])
    );

    res.json(formattedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
}

// GET /api/orders/:id
async function getOrderById(req, res) {
  const { id } = req.params;

  try {
    const [orders] = await pool.query(
      `SELECT
        o.id,
        o.branch_id,
        b.name AS branch_name,
        o.customer_name,
        o.customer_phone,
        o.order_type,
        o.table_number,
        o.subtotal,
        o.vat_amount,
        o.total,
        o.status,
        o.created_at,
        o.updated_at
      FROM orders o
      JOIN branches b ON o.branch_id = b.id
      WHERE o.id = ?`,
      [Number(id)]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const [items] = await pool.query(
      `SELECT
        oi.id,
        oi.order_id,
        oi.product_id,
        p.name AS product_name,
        oi.quantity,
        oi.unit_price,
        oi.line_total
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
      ORDER BY oi.id ASC`,
      [Number(id)]
    );

    const formattedItems = items.map((item) => ({
      id: item.id,
      productId: item.product_id,
      productName: item.product_name || `Item #${item.product_id}`,
      price: Number(item.unit_price),
      quantity: item.quantity,
      lineTotal: Number(item.line_total),
    }));

    res.json(formatOrder(orders[0], formattedItems));
  } catch (error) {
    console.error("Error fetching order:", error.message);
    res.status(500).json({ message: "Failed to fetch order" });
  }
}

// POST /api/orders - Create a new order with transactional integrity
async function createOrder(req, res) {
  const {
    branchId,
    branch_id,
    customerName,
    customer_name,
    phone,
    customer_phone,
    type,
    order_type,
    tableNumber,
    table_number,
    subtotal,
    vatAmount,
    vat_amount,
    total,
    items,
  } = req.body;

  const resolvedBranchId = Number(branchId || branch_id);
  const resolvedCustomerName = (customerName || customer_name || "").trim();
  const resolvedPhone = (phone || customer_phone || "").trim();
  const rawType = type || order_type || "takeaway";
  const resolvedOrderType = rawType === "dine-in" ? "dine_in" : rawType;
  const resolvedTableNumber = tableNumber || table_number || null;

  // Validate branch
  if (!resolvedBranchId || isNaN(resolvedBranchId)) {
    return res.status(400).json({ message: "A valid branch ID is required" });
  }

  // Validate order type
  const validOrderTypes = ["dine_in", "takeaway", "delivery"];
  if (!validOrderTypes.includes(resolvedOrderType)) {
    return res.status(400).json({
      message: "Order type must be dine-in, takeaway, or delivery",
    });
  }

  // Validate items
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Order must contain at least one item" });
  }

  for (const item of items) {
    if (!item.productId && !item.product_id) {
      return res.status(400).json({ message: "Each item must specify a product ID" });
    }
    const qty = Number(item.quantity);
    if (!qty || qty <= 0) {
      return res.status(400).json({ message: "Item quantity must be greater than zero" });
    }
  }

  // Calculate or verify totals
  let calculatedSubtotal = 0;
  const processedItems = items.map((i) => {
    const unitPrice = Number(i.price != null ? i.price : 0);
    const qty = Number(i.quantity) || 1;
    const lineTotal = Math.round(unitPrice * qty * 100) / 100;
    calculatedSubtotal += lineTotal;
    return {
      productId: Number(i.productId || i.product_id),
      productName: i.productName || i.name || `Product #${i.productId || i.product_id}`,
      price: unitPrice,
      quantity: qty,
      lineTotal,
    };
  });

  const finalSubtotal = subtotal != null ? Number(subtotal) : calculatedSubtotal;
  const finalVatAmount = vatAmount != null
    ? Number(vatAmount)
    : vat_amount != null
    ? Number(vat_amount)
    : Math.round(finalSubtotal * 0.15 * 100) / 100;
  const finalTotal = total != null
    ? Number(total)
    : Math.round((finalSubtotal + finalVatAmount) * 100) / 100;

  // Use database transaction for atomicity
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Verify branch exists and is active
    const [branchRows] = await connection.query(
      "SELECT id, name, is_active FROM branches WHERE id = ?",
      [resolvedBranchId]
    );
    if (branchRows.length === 0 || !branchRows[0].is_active) {
      await connection.rollback();
      return res.status(400).json({ message: "Selected branch does not exist or is inactive" });
    }

    // 1. Insert order
    const [orderResult] = await connection.query(
      `INSERT INTO orders
       (branch_id, customer_name, customer_phone, order_type, table_number, subtotal, vat_amount, total, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        resolvedBranchId,
        resolvedCustomerName || null,
        resolvedPhone || null,
        resolvedOrderType,
        resolvedTableNumber,
        finalSubtotal,
        finalVatAmount,
        finalTotal,
      ]
    );

    const orderId = orderResult.insertId;

    // 2. Insert items into order_items
    for (const item of processedItems) {
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.productId, item.quantity, item.price, item.lineTotal]
      );
    }

    await connection.commit();

    // Retrieve the newly committed order to return full details to customer
    const [newOrderRows] = await pool.query(
      `SELECT
        o.id,
        o.branch_id,
        b.name AS branch_name,
        o.customer_name,
        o.customer_phone,
        o.order_type,
        o.table_number,
        o.subtotal,
        o.vat_amount,
        o.total,
        o.status,
        o.created_at,
        o.updated_at
      FROM orders o
      JOIN branches b ON o.branch_id = b.id
      WHERE o.id = ?`,
      [orderId]
    );

    const createdOrder = formatOrder(newOrderRows[0], processedItems);
    res.status(201).json(createdOrder);
  } catch (error) {
    await connection.rollback();
    console.error("Error creating order transaction:", error.message);
    res.status(500).json({ message: "Failed to place order due to server error" });
  } finally {
    connection.release();
  }
}

// PATCH /api/orders/:id/status - Update order status
async function updateOrderStatus(req, res) {
  const { id } = req.params;
  const orderId = Number(id);
  const { status } = req.body;

  if (isNaN(orderId)) {
    return res.status(400).json({ message: "Invalid order ID" });
  }

  const validStatuses = ["pending", "confirmed", "preparing", "ready", "completed", "cancelled"];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
    });
  }

  try {
    const [existing] = await pool.query("SELECT id FROM orders WHERE id = ?", [orderId]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    await pool.query("UPDATE orders SET status = ? WHERE id = ?", [status, orderId]);

    // Return the updated order with items
    const [orders] = await pool.query(
      `SELECT
        o.id,
        o.branch_id,
        b.name AS branch_name,
        o.customer_name,
        o.customer_phone,
        o.order_type,
        o.table_number,
        o.subtotal,
        o.vat_amount,
        o.total,
        o.status,
        o.created_at,
        o.updated_at
      FROM orders o
      JOIN branches b ON o.branch_id = b.id
      WHERE o.id = ?`,
      [orderId]
    );

    const [items] = await pool.query(
      `SELECT
        oi.id,
        oi.order_id,
        oi.product_id,
        p.name AS product_name,
        oi.quantity,
        oi.unit_price,
        oi.line_total
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
      ORDER BY oi.id ASC`,
      [orderId]
    );

    const formattedItems = items.map((item) => ({
      id: item.id,
      productId: item.product_id,
      productName: item.product_name || `Item #${item.product_id}`,
      price: Number(item.unit_price),
      quantity: item.quantity,
      lineTotal: Number(item.line_total),
    }));

    res.json(formatOrder(orders[0], formattedItems));
  } catch (error) {
    console.error("Error updating order status:", error.message);
    res.status(500).json({ message: "Failed to update order status" });
  }
}

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
};
