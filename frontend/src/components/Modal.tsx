import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import Button from './Button'

interface ModalProps {
    isOpen: boolean
    title: string
    onClose: () => void
    children: ReactNode
}

const Modal = ({ isOpen, title, onClose, children }: ModalProps) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md bg-sidebar text-sidebar-text rounded-2xl shadow-lg p-6 mx-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-sidebar-text">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-text-muted hover:text-text transition-colors duration-150"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                {children}
            </div>
        </div>
    )
}

export default Modal