"use client";

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
              className={"w-full focus:ring-violet-700 ring-violet-700"}/>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                  className="w-full border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-400/60"
                  slot="close"
                >
                Cancel
              </Button>
              <Button 
              isDisabled={!itemName || itemName.trim() === "" || loading} 
              className="w-full bg-violet-700 hover:bg-violet-600" 
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