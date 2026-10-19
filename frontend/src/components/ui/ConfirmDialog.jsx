import Modal from './Modal'
import Button from './Button'

/**
 * A reusable confirmation dialog built on top of Modal.
 *
 * Contract:
 *  - onClose  : called when the user clicks Cancel or the backdrop.
 *  - onConfirm: called when the user clicks the confirm button.
 *               The caller is responsible for also calling onClose()
 *               after any async work completes.
 */
const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger = false }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    size="sm"
    descriptionId="confirm-dialog-description"
  >
    <div className="p-6">
      {/* Theme contrast: uses text-surface-secondary for readability in both light & dark modes */}
      <p id="confirm-dialog-description" className="text-surface-secondary text-sm mb-6 leading-relaxed">
        {message}
      </p>
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" size="sm" onClick={onClose}>
          Cancel
        </Button>
        {/* BUG-06 fix: only call onConfirm; caller controls when to close */}
        <Button
          variant={danger ? 'danger' : 'primary'}
          size="sm"
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  </Modal>
)

export default ConfirmDialog
