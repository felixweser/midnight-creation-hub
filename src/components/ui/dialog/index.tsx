import * as DialogPrimitive from "@radix-ui/react-dialog"
import { DialogContent } from "./DialogContent"
import { DialogHeader, DialogFooter } from "./DialogHeader"
import { DialogTitle, DialogDescription } from "./DialogTitle"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogClose = DialogPrimitive.Close

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
}