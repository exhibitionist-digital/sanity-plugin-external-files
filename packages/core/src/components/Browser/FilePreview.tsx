import { CheckmarkIcon, EditIcon } from '@sanity/icons'
import { Button, Card, Flex, Stack } from '@sanity/ui'
import React from 'react'

import { SanityUpload } from '../../types'
import FileMetadata from '../FileMetadata'
import MediaPreview from '../MediaPreview'

interface FilePreviewProps {
  onSelect?: (file: SanityUpload) => void
  onEdit?: (file: SanityUpload) => void
  file: SanityUpload
}

const FilePreview: React.FC<FilePreviewProps> = ({
  onSelect,
  onEdit,
  file,
}) => {
  const select = React.useCallback(() => onSelect?.(file), [onSelect, file])
  const edit = React.useCallback(() => onEdit?.(file), [onEdit, file])

  if (!file) {
    return null
  }

  return (
    <Card border padding={2} sizing="border" radius={2}>
      <Stack
        space={3}
        height="fill"
        style={{
          gridTemplateRows: 'min-content min-content 1fr',
        }}
      >
        <MediaPreview file={file} context="browser" />
        <FileMetadata file={file} />
        <Flex align="flex-end" justify="flex-start" gap={1}>
          {onSelect && (
            <Button
              icon={CheckmarkIcon}
              fontSize={2}
              padding={2}
              mode="ghost"
              text="Select"
              style={{ flex: 1 }}
              tone="positive"
              onClick={select}
            />
          )}
          <Button
            icon={EditIcon}
            fontSize={1}
            padding={2}
            mode="ghost"
            text="Details"
            style={{ flex: 1 }}
            onClick={edit}
          />
        </Flex>
      </Stack>
    </Card>
  )
}

export default FilePreview
