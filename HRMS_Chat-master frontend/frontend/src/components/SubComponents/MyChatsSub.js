import { AddIcon } from '@chakra-ui/icons'
import { Box, Stack, Text } from '@chakra-ui/layout'
import { useToast } from '@chakra-ui/toast'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { getSender } from '../../config/ChatLogics'
import { ChatLoading } from '../Misc/ChatLoading'
import GroupChatModal from '../Misc/GroupChatModal'
import { Button } from '@chakra-ui/react'
import { io } from 'socket.io-client'

const ENDPOINT = 'http://localhost:5000'

const socket = io(ENDPOINT)

const MyChatsSub = ({ fetchAgain, props }) => {
  const [currentChats, setCurrentChats] = useState([])
  const { selectedChat, setSelectedChat, user, chats, chatUser, setChatUser } =
    props
  const toast = useToast()

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.get('/api/chat', config)
      setCurrentChats(data)
    } catch (error) {
      toast({
        title: 'Error Ocurred!',
        description: 'Failed to Load the chats',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left'
      })
    }
  }

  useEffect(() => {
    let unmounted = false

    if (!unmounted) {
      fetchChats()
    }

    return () => {
      unmounted = true
    }
  }, [chats])

  // To catch socket when new chat creqated

  socket.on('new chats', async (payload) => {
    console.log('inside new chats on receive')
    setCurrentChats([payload, ...currentChats])
  })

  return (
    <Box
      d={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: '100%', md: '31%' }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: '28px', md: '30px' }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: '17px', md: '10px', lg: '17px' }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {currentChats ? (
          <Stack overflowY="scroll">
            {currentChats.map((chat, i) => (
              <Box
                onClick={() => {
                  setSelectedChat(chat)
                }}
                cursor="pointer"
                bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                color={selectedChat === chat ? 'white' : 'black'}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat ? (
                    getSender(user, currentChats[i].users)
                  ) : (
                    <strong>{chat.chatName.toUpperCase()}</strong>
                  )}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>
                      {chat.isGroupChat && chat.latestMessage.sender.name + ':'}
                    </b>
                    {chat.latestMessage.content.length > 25
                      ? chat.latestMessage.content.substring(0, 25) + '...'
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  )
}

export default MyChatsSub
