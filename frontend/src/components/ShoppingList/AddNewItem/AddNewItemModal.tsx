"use client";

import { BUTTON_STYLES } from "@/constants/buttonStyles";
import { INPUT_STYLES } from "@/constants/inputStyles";
import { useAddShoppingItem } from "@/hooks/useAddShoppingItem";
import {Button, Modal, Input} from "@heroui/react";
import { useEffect, useState } from "react";

interface Props {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export function AddNewItemModal({ isOpen, setIsOpen }: Props) {
    const { add, loading } = useAddShoppingItem();
    const [itemName, setItemName] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setItemName("");
        }
    }, [isOpen]);

  return (
      <Modal.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
        <Modal.Container size="sm">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>New item</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="p-1">
                <form onSubmit={(e) => {
                    if (!itemName || itemName.trim() === "") return;
                    e.preventDefault();
                    add(itemName);
                    setIsOpen(false);
                }}>
              <Input 
              value={itemName} 
              onChange={(e) => setItemName(e.target.value)} 
              autoFocus 
              placeholder="Enter item name" 
              className={INPUT_STYLES.primary}/>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                  className={BUTTON_STYLES.secondary}
                  slot="close"
                >
                Cancel
              </Button>
              <Button 
              isDisabled={!itemName || itemName.trim() === "" || loading} 
              className={BUTTON_STYLES.primary}
              slot="close"
              onClick={() => add(itemName)}
              >
                Continue
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
  );
}