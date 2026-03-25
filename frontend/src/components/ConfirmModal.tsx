import Modal from './Modal'
import Button from './Button'

interface ConfirmModalProps {
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    onCancel: () => void
    isLoading?: boolean
}

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isLoading }: ConfirmModalProps) => {
    return (
        <Modal isOpen={isOpen} title={title} onClose={onCancel}>
            <p className="text-sm text-sidebar-text mb-6">{message}</p>

            <div className="flex justify-end gap-2">
                <Button
                    text="Odustani"
                    variant="secondary"
                    onClick={onCancel}
                    type="button"
                />
                <Button
                    text="Potvrdi"
                    variant="primary"
                    onClick={onConfirm}
                    isLoading={isLoading}
                    type="button"
                />
            </div>
        </Modal>
    )
}

export default ConfirmModal