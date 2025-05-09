import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Text,
  Select,
  useDisclosure,
  Badge
} from '@chakra-ui/react';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/scheduled-collection/assigned');
      setTasks(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch assigned tasks',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) {
      toast({
        title: 'Error',
        description: 'Please select a status',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      await axios.put(`/api/scheduled-collection/status/${selectedTask._id}`, {
        status: newStatus
      });

      toast({
        title: 'Success',
        description: 'Status updated successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onClose();
      fetchTasks();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update status',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const openStatusModal = (task) => {
    setSelectedTask(task);
    setNewStatus(task.status);
    onOpen();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Assigned':
        return 'blue';
      case 'Not Arrived':
        return 'red';
      case 'On the Way':
        return 'orange';
      case 'Picked Up':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <Box p={6}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Client</Th>
            <Th>Location</Th>
            <Th>Description</Th>
            <Th>Priority</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tasks.map((task) => (
            <Tr key={task._id}>
              <Td>{new Date(task.date).toLocaleString()}</Td>
              <Td>
                <VStack align="start" spacing={1}>
                  <Text>{task.clientName}</Text>
                  <Text fontSize="sm" color="gray.500">{task.clientPhone}</Text>
                </VStack>
              </Td>
              <Td>{task.location}</Td>
              <Td>{task.description}</Td>
              <Td>{task.priority}</Td>
              <Td>
                <Badge colorScheme={getStatusColor(task.status)}>
                  {task.status}
                </Badge>
              </Td>
              <Td>
                <Button
                  colorScheme="blue"
                  size="sm"
                  onClick={() => openStatusModal(task)}
                >
                  Update Status
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Task Status</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Text>Current Status: {selectedTask?.status}</Text>
              <Select
                placeholder="Select new status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="Not Arrived">Not Arrived</option>
                <option value="On the Way">On the Way</option>
                <option value="Picked Up">Picked Up</option>
              </Select>
              <Button colorScheme="blue" onClick={handleStatusUpdate}>
                Update
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TaskManagement; 