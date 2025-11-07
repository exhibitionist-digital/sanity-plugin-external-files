import { PublishIcon, WarningOutlineIcon } from '@sanity/icons'
import { Schema } from '@sanity/schema'
import { ValidationMarker } from '@sanity/types'
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Label,
  Spinner,
  Stack,
  Text,
  TextInput,
} from '@sanity/ui'
import React from 'react'
import {
  AcceptedCredentialField,
  VendorConfiguration,
  VendorCredentials,
} from '../../types'
import FormField from '../FormField'
import { CredentialsContext } from './CredentialsProvider'

const ConfigureCredentials: React.FC<{
  onCredentialsSaved?: (success: boolean) => void
  vendorConfig: VendorConfiguration
}> = (props) => {
  const { saveCredentials, credentials } = React.useContext(CredentialsContext)
  const [isLoading, setIsLoading] = React.useState(false)
  const [markers, setMarkers] = React.useState<ValidationMarker[]>([])
  const hasErrors = markers.some((marker) => marker.level === 'error')

  // Form values:
  const [formValues, setFormValues] = React.useState<VendorCredentials>({})

  async function submitCredentials(e: React.FormEvent) {
    e.preventDefault()
    if (hasErrors) return
    setIsLoading(true)
    const success = await saveCredentials(formValues)
    setIsLoading(false)
    if (props.onCredentialsSaved) {
      props.onCredentialsSaved(success)
    }
  }

  React.useEffect(() => {
    if (credentials) {
      setFormValues(credentials)
    }
  }, [])

  function resolveFieldHandler(field: AcceptedCredentialField) {
    return (e: React.FormEvent<HTMLInputElement>) => {
      e.preventDefault()
      setFormValues({
        ...formValues,
        [field.name]:
          e.currentTarget.value !== '' ? e.currentTarget.value : undefined,
      })
    }
  }

  const schema = React.useMemo(
    () =>
      new Schema({
        name: 'vendorSchema',
        types: [
          {
            name: 'vendorCredentials',
            type: 'document',
            fields: props.vendorConfig.credentialsFields,
          },
        ],
      }),
    [props.vendorConfig.credentialsFields],
  )

  async function validateForm(values: typeof formValues) {
    // @TODO: how to replace the deprecated @sanity/validation package?
    // const newMarkers = await validateDocument(
    //   useClient,
    //   { ...values, _type: 'vendorCredentials' } as any,
    //   schema,
    // )
    // setMarkers(newMarkers)
  }

  React.useEffect(() => {
    if (Object.keys(formValues).length > 0) {
      validateForm(formValues)
    }
  }, [formValues])

  if (props.vendorConfig.credentialsFields?.length === 0) return null

  return (
    <Card padding={4}>
      <Stack space={3}>
        {credentials ? (
          <Stack space={4}>
            <Card tone="caution" padding={2}>
              <Flex align="center" gap={2}>
                <WarningOutlineIcon />
                <Text size={1}>
                  Be careful when changing these settings as they can prevent
                  file access.
                </Text>
              </Flex>
            </Card>
          </Stack>
        ) : (
          <Stack space={4}>
            <Label size={2} muted>
              External media library
            </Label>
            <Heading size={2}>First time setup</Heading>
            <Text size={1}>
              In order to communicate with external vendor to upload videos &
              audio, you’ll have to set-up credentials below:
            </Text>
          </Stack>
        )}
        {props.vendorConfig.credentialsFields?.length ? (
          <Box as="form" marginTop={4} onSubmit={submitCredentials}>
            <Stack space={4}>
              {props.vendorConfig.credentialsFields.map((field) => {
                const fieldMarkers = markers.filter(
                  (marker) => marker.path[0] === field.name,
                )
                const hasError = fieldMarkers?.some(
                  (marker) => marker.level === 'error',
                )
                return (
                  <FormField
                    key={field.name}
                    label={field.title || field.name}
                    description={field.description}
                    markers={fieldMarkers}
                  >
                    <TextInput
                      icon={field.icon}
                      onInput={resolveFieldHandler(field)}
                      value={formValues[field.name] || ''}
                      type={field.type === 'number' ? 'number' : 'text'}
                      disabled={isLoading}
                      required={hasError}
                    />
                  </FormField>
                )
              })}
              <Button
                text="Save credentials"
                icon={PublishIcon}
                iconRight={isLoading && Spinner}
                tone="positive"
                fontSize={2}
                padding={3}
                type="submit"
                disabled={
                  isLoading ||
                  markers.filter((marker) => marker.level === 'error').length >
                    0
                }
              />
            </Stack>
          </Box>
        ) : (
          <>
            <Heading size={3}>Plugin configured incorrectly</Heading>
            <Text size={3}>
              Missing the credentialsField configuration property
            </Text>
          </>
        )}
      </Stack>
    </Card>
  )
}

export default ConfigureCredentials
