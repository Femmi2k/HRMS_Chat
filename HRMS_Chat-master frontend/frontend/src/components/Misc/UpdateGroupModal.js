import { Button, IconButton } from '@chakra-ui/button'
import { FormControl } from '@chakra-ui/form-control'
import { useDisclosure } from '@chakra-ui/hooks'
import { ViewIcon } from '@chakra-ui/icons'
import { Input } from '@chakra-ui/input'
import { Box } from '@chakra-ui/layout'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/modal'
import React, { useContext, useState } from 'react'
import UserBadgeItem from '../UserAvatar/UserBadgeAvatar'
import UserListItem from '../UserAvatar/UserListItem'

import { useToast } from '@chakra-ui/toast'
import { Spinner } from '@chakra-ui/spinner'
import axios from 'axios'
import { ChatContext } from '../../Context/chatProvider'

const UpdateGroupModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { selectedChat, setSelectedChat, user } = useContext(ChatContext)
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groupChatName, setGroupChatName] = useState()
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [renameloading, setRenameLoading] = useState(false)

  const handleRemove = async (userr) => {
    if (selectedChat.groupAdmin._id !== user._id && userr._id !== user._id) {
      toast({
        title: 'Only admins can remove someone!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom'
      })
      return
    }

    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: userr._id
        },
        config
      )

      userr._id === user._id ? setSelectedChat() : setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      fetchMessages()
      setLoading(false)
    } catch (error) {
      toast({
        title: 'An Error Ocurred',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom'
      })
    }
  }

  const handleRename = async () => {
    if (!groupChatName) return

    try {
      setRenameLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName
        },
        config
      )

      console.log(data._id)

      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      fetchMessages()
      setRenameLoading(false)
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom'
      })
      setRenameLoading(false)
    }
    setGroupChatName('')
  }

  const handleSearch = async (query) => {
    setSearch(query)
    if (!query) {
      return
    }
    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.get(`/api/user?search=${search}`, config)
      console.log(data)
      setLoading(false)
      setSearchResult(data)
    } catch (error) {
      toast({
        title: 'Error Ocurred!',
        description: 'Failed to Load the Search Results',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left'
      })
      setLoading(false)
    }
  }

  const handleAddUser = async (userr) => {
    if (selectedChat.users.find((u) => u._id === userr._id)) {
      toast({
        title: 'User is already in the group',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom'
      })
      return
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: 'Only admins can add someone!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom'
      })
      return
    }

    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: userr._id
        },
        config
      )

      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      fetchMessages()
      setLoading(false)
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom'
      })
      setLoading(false)
    }
    setGroupChatName('')
  }

  return (
    <>
      <IconButton d={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl d="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupModal
