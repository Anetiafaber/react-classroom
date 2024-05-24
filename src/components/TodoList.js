import {
  HStack,
  VStack,
  Text,
  Flex,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Divider,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import React, { useState } from "react";

function TodoList({ todos, deleteTodo, editTodo }) {
  const [todo, setTodo] = useState("");
  const [editModalValue, setEditModalValue] = useState({});
  const [deleteModalValue, setDeleteModalValue] = useState({});
  const [editIsOpen, setEditIsOpen] = useState(false);
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);

  function onEditClose() {
    setEditIsOpen(false);
  }

  function onDeleteClose() {
    setDeleteIsOpen(false);
  }

  function handleEditClick(todo) {
    setEditIsOpen(true);
    setEditModalValue(todo);
    console.log(todo);
  }

  function handleDeleteClick(id) {
    setDeleteIsOpen(true);
    setDeleteModalValue(id);
    console.log(id);
  }

  function handleEditInputChange(e, id) {
    setEditModalValue({ ...editModalValue, text: e.target.value });
    console.log(editModalValue, id);
  }

  function handleEditSubmit(e) {
    e.preventDefault();

    editTodo(editModalValue.id, editModalValue);
    setEditModalValue("");
    setEditIsOpen(false);
  }

  function handleDeleteSubmit(e) {
    e.preventDefault();

    deleteTodo(deleteModalValue);
    setDeleteModalValue("");
    setDeleteIsOpen(false);
  }

  return !todos.length ? (
    <Badge colorScheme="purple" variant="outline" borderRadius="4" p="4" m="5">
      No todos for Today!!
    </Badge>
  ) : (
    <VStack>
      {todos.map((todo) => (
        <HStack spacing="24px" w="320px">
          <Flex p={6} w="300px" h="50px" justifyContent="space-between">
            <Text>{todo.text}</Text>

            <Flex w="10px">
              <DeleteIcon
                color="red.500"
                mr="2"
                onClick={() => handleDeleteClick(todo.id)}
              />
              <EditIcon onClick={() => handleEditClick(todo)} />
            </Flex>

            {/* modal for editing a todo */}
            <Modal isOpen={editIsOpen} onClose={onEditClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Edit Your Todo</ModalHeader>
                <ModalCloseButton />
                <form onSubmit={handleEditSubmit}>
                  <ModalBody>
                    <Input
                      value={editModalValue.text}
                      key={editModalValue.id}
                      variant="outline"
                      type="text"
                      placeholder="Update your todo..."
                      onChange={handleEditInputChange}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button colorScheme="teal" mr={3} onClick={onEditClose}>
                      Close
                    </Button>
                    <Button type="submit" colorScheme="teal" mr={3}>
                      Update
                    </Button>
                  </ModalFooter>
                </form>
              </ModalContent>
            </Modal>

            {/* modal for editing a todo */}
            <Modal isOpen={deleteIsOpen} onClose={onDeleteClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Delete Your Todo</ModalHeader>
                <ModalCloseButton />
                <form onSubmit={handleDeleteSubmit}>
                  <ModalBody>
                    <Text>
                      Do you want to delete this item?
                    </Text>
                  </ModalBody>
                  <ModalFooter>
                    <Button colorScheme="teal" mr={3} onClick={onDeleteClose}>
                      Close
                    </Button>
                    <Button type="submit" colorScheme="teal" mr={3}>
                      Delete
                    </Button>
                  </ModalFooter>
                </form>
              </ModalContent>
            </Modal>
          </Flex>
        </HStack>
      ))}
    </VStack>
  );
}

export default TodoList;
