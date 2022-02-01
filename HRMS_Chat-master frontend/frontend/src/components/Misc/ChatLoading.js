import { Stack } from '@chakra-ui/layout'
import { Skeleton } from '@chakra-ui/skeleton'
import React from 'react'

export const ChatLoading = () => {
  return (
    <Stack>
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
    </Stack>
  )
}
