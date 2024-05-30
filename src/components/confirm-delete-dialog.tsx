import { Trash } from 'lucide-react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import React from 'react'

interface ConfirmDeleteDialogProps {
  onConfirm: () => void
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  onConfirm,
}) => {
  return (
    <Dialog modal>
      <DialogTrigger asChild>
        <Button variant="outline" className="py-2 px-3">
          <Trash size="16" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Você tem certeza?</DialogTitle>
          <DialogDescription>
            Essa ação não pode ser desfeita. Vamos remover permanentemente esse
            recurso e removê-lo de nossos servidores.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={onConfirm}>
              Deletar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmDeleteDialog
