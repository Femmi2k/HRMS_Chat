import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast
} from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

const Signup = () => {
  const [show, setShow] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [password, setPassword] = useState('')
  const [pic, setPic] = useState('')
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const history = useHistory()

  const postDetails = (pics) => {
    setLoading(true)

    if (pics === undefined) {
      toast({
        title: 'Please Select an Image',
        status: 'warning',
        duration: 4000,
        isClosable: true,
        position: 'bottom'
      })
      return
    }

    if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
      const data = new FormData()
      data.append('file', pics)
      data.append('upload_preset', 'hrms-chat')
      data.append('cloud-name', 'artribebpo')
      fetch('https://api.cloudinary.com/v1_1/artribebpo/image/upload', {
        method: 'post',
        body: data
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString())
          setLoading(false)
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
        })
    } else {
      toast({
        title: 'Please Select an Image',
        status: 'warning',
        duration: 4000,
        isClosable: true,
        position: 'bottom'
      })
      return
    }
  }

  //SUBMIT
  const submitHandler = async () => {
    setLoading(true)
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: 'Please Fill all the Fields',
        status: 'warning',
        duration: 4000,
        isClosable: true,
        position: 'bottom'
      })
      setLoading(false)
      return
    }
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords Do Not Match',
        status: 'warning',
        duration: 4000,
        isClosable: true,
        position: 'bottom'
      })
      return
    }
    try {
      const config = {
        headers: {
          'Content-type': 'application/json'
        }
      }
      const { data } = await axios.post(
        '/api/user',
        {
          name,
          email,
          password,
          pic
        },
        config
      )
      console.log(data)
      toast({
        title: 'Registration Successful',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom'
      })
      localStorage.setItem('userInfo', JSON.stringify(data))
      setLoading(false)
      history.push('/chats')
    } catch (error) {
      toast({
        title: 'An Error Occured!',
        description: error.response.data.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom'
      })
      setLoading(false)
    }
  }

  const picLoading = () => {}

  return (
    <VStack spacing="" color="black">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Name"
          onChange={(e) => {
            setName(e.target.value)
          }}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>E-mail</FormLabel>
        <Input
          placeholder="Enter E-mail"
          onChange={(e) => {
            setEmail(e.target.value)
          }}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            placeholder="Enter Password"
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="confirmpassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            placeholder="Confirm Password"
            onChange={(e) => {
              setConfirmPassword(e.target.value)
            }}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic">
        <FormLabel>Upload Profile Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => {
            postDetails(e.target.files[0])
          }}
        />
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        color="white"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  )
}

export default Signup
