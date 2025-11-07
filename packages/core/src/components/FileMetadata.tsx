import { CalendarIcon, ClockIcon, DownloadIcon } from '@sanity/icons'
import { Box, Inline, Stack, Text } from '@sanity/ui'
import React from 'react'
import formatBytes from '../scripts/formatBytes'
import formatSeconds from '../scripts/formatSeconds'
import { SanityUpload } from '../types'
import IconInfo from './IconInfo'

interface FileMetadataProps {
  file: SanityUpload
}

const FileMetadata: React.FC<FileMetadataProps> = ({ file }) => {
  if (!file) {
    return null
  }
  return (
    <Stack space={2}>
      <Stack space={2}>
        <Text
          size={2}
          weight="semibold"
          style={{
            wordWrap: 'break-word',
          }}
        >
          {file.title || file.fileName}
        </Text>
        {file.description && (
          <Box marginBottom={2} style={{ lineClamp: 2 }}>
            <Text size={1} muted>
              {file.description}
            </Text>
          </Box>
        )}
      </Stack>
      <Inline space={2}>
        {file.duration && (
          <IconInfo
            text={formatSeconds(file.duration)}
            icon={ClockIcon}
            muted
          />
        )}
        {file.fileSize && (
          <IconInfo
            text={formatBytes(file.fileSize)}
            icon={DownloadIcon}
            muted
          />
        )}
        <IconInfo
          text={new Date(file._createdAt).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'medium',
            hourCycle: 'h12',
          })}
          icon={CalendarIcon}
          muted
        />
      </Inline>
    </Stack>
  )
}

export default FileMetadata
