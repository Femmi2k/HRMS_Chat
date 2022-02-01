import { Button } from '@chakra-ui/button'
import { Text } from '@chakra-ui/layout'
import { Box } from '@chakra-ui/layout'
import { MenuButton, MenuDivider, MenuItem } from '@chakra-ui/menu'
import { Menu } from '@chakra-ui/menu'
import { Tooltip } from '@chakra-ui/tooltip'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import React, { useEffect, useState } from 'react'
import { MenuList } from '@chakra-ui/menu'
import { Avatar } from '@chakra-ui/avatar'
import ProfileModal from '../Misc/ProfileModal'

import { useDisclosure } from '@chakra-ui/hooks'
import { Input } from '@chakra-ui/input'
import { useToast } from '@chakra-ui/toast'
import { ChatLoading } from '../Misc/ChatLoading'
import UserListItem from '../UserAvatar/UserListItem'
import { Spinner } from '@chakra-ui/spinner'

import { getSender } from '../../config/ChatLogics'
import io from 'socket.io-client'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay
} from '@chakra-ui/modal'

const ENDPOINT = 'http://localhost:5000'
var socket

const SideDrawerSub = ({ props }) => {
  const {
    setSelectedChat,
    chats,
    setChats,
    user,
    setUser,
    notifications,
    setNotifications,
    chatUser,
    setChatUser
  } = props

  const [allNotifs, setAllNotifs] = useState([])
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState(false)
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const history = useHistory()

  const logoutHandler = () => {
    localStorage.removeItem('userInfo')
    setUser(null)
    setChats([])
    setSelectedChat(null)
    history.push('/')
  }

  useEffect(() => {
    let unmounted = false

    if (!unmounted) {
      socket = io(ENDPOINT)
      socket.emit('setup', user)
      // fetchNotifications()
    } else console.log('gay')

    return () => {
      unmounted = true
    }
  }, [])
  // console.log(allNotifs)
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please Enter something in search',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left'
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

      const { data } = await axios.get(`/api/user?search=${search}`, config)

      setLoading(false)
      setSearchResult(data)
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to Load the Search Results',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left'
      })
    }
  }
  const fetchNotifications = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.get('/api/chat', config)
      setAllNotifs(data)
    } catch (error) {
      toast({
        title: 'Error Ocurred!',
        description: 'Failed to Load the notifications',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left'
      })
    }
  }

  const removeNotif = async (notifId, notif) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      setLoading(true)

      const { data } = await axios.delete(
        `/api/notifs/remove/${notifId}`,
        config
      )
    } catch (error) {
      toast({
        title: 'Error Ocurred!',
        description: 'Failed to process the Notification',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom'
      })
    }

    setAllNotifs(notifications.filter((n) => n !== notif))
  }

  // const accessChat = async (userInfo) => {
  //   try {
  //     setLoadingChat(true)
  //     setChatUser(userInfo)
  //     const config = {
  //       headers: {
  //         'Content-type': 'application/json',
  //         Authorization: `Bearer ${user.token}`
  //       }
  //     }
  //     const { data } = await axios.post(`/api/chat`, { userInfo }, config)

  //     if (!chats.find((c) => c._id === data._id)) {
  //       socket.emit('get chat', data)
  //       setChats([data, ...chats])
  //       setSelectedChat(data)
  //     }
  //     setLoadingChat(false)
  //     onClose()
  //   } catch (error) {
  //     toast({
  //       title: 'Error fetching the chat',
  //       description: error.message,
  //       status: 'error',
  //       duration: 5000,
  //       isClosable: true,
  //       position: 'bottom-left'
  //     })
  //   }
  // }

  const accessChat = async (userInfo) => {
    try {
      setLoadingChat(true)
      setChatUser(userInfo)

      const data = {
        _id: 'random Bullshit',
        chatName: `${user.name}/${userInfo.name}`,
        isGroupChat: false,
        users: [
          { _id: user._id, name: user.name, email: user.email, pic: user.pic },
          {
            _id: userInfo._id,
            name: userInfo.name,
            email: userInfo.email,
            pic: userInfo.pic
          }
        ]
      }

      if (
        !chats.find(
          //if chat with the name given above or it's vice versa isn't found
          (c) =>
            c.chatName === data.chatName ||
            c.chatName === `${userInfo.name}/${user.name}`
        )
      ) {
        setChats([data, ...chats])
        setSelectedChat(data)
        console.log('New Fake Chat', data)
      }
      setLoadingChat(false)
      onClose()
    } catch (error) {
      toast({
        title: 'Error fetching the chat',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left'
      })
    }
  }

  return user !== undefined ? (
    <>
      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: 'none', md: 'flex' }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          HRMS
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!allNotifs.length && 'No New Messages'}
              {allNotifs?.map((notif, i) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat)

                    removeNotif(notif.chat._id, notif)
                  }}
                >
                  {notif?.chat?.isGroupChat
                    ? `New Message in ${notif?.chat?.chatName}`
                    : `New Message from ${getSender(user, notif?.chat?.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>

            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>{' '}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  ) : (
    <div>Loading User</div>
  )
}

export default SideDrawerSub
