import { Modal as NModal, ModalContent, ModalProps } from "@nextui-org/react";
import clsx from "clsx";
import { FC } from "react";

const Modal: FC<ModalProps> = ({ className, ...props }) => (
  <NModal className={clsx("p-10", className)} {...props}>
    <ModalContent>{props?.children}</ModalContent>
  </NModal>
);

export default Modal;
