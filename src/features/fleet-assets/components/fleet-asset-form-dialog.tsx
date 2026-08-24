import { useEffect } from 'react'
import { AxiosError } from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { handleServerError } from '@/lib/handle-server-error'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SelectDropdown } from '@/components/select-dropdown'
import {
  fleetAssetStatuses,
  fleetAssetTypes,
  tyreConstructionOptions,
  tyreTubeTypeOptions,
} from '../data/constants'
import {
  fleetAssetFormSchema,
  type FleetAsset,
  type FleetAssetFormValues,
} from '../data/schema'
import {
  createFleetAsset,
  updateFleetAsset,
} from '../api/fleet-assets'
import { useFleetAssets } from './fleet-assets-provider'

type FleetAssetFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentAsset?: FleetAsset | null
}

const emptyValues: FleetAssetFormValues = {
  assetCode: '',
  assetName: '',
  assetType: 'Tyre',
  brand: '',
  model: '',
  status: 'Active',
  description: '',
  tyreSpecifications: {
    tyreSize: '',
    construction: 'Radial',
    pattern: '',
    loadIndex: '',
    speedRating: '',
    plyRating: '',
    tubeType: 'Tubeless',
  },
}

export function FleetAssetFormDialog({
  open,
  onOpenChange,
  currentAsset,
}: FleetAssetFormDialogProps) {
  const isEdit = !!currentAsset
  const queryClient = useQueryClient()
  const { closeDialog } = useFleetAssets()

  const form = useForm<FleetAssetFormValues>({
    resolver: zodResolver(fleetAssetFormSchema),
    defaultValues: currentAsset
      ? {
          assetCode: currentAsset.assetCode,
          assetName: currentAsset.assetName,
          assetType: currentAsset.assetType,
          brand: currentAsset.brand,
          model: currentAsset.model,
          status: currentAsset.status,
          description: currentAsset.description ?? '',
          tyreSpecifications: {
            tyreSize: currentAsset.tyreSpecifications.tyreSize,
            construction: currentAsset.tyreSpecifications.construction,
            pattern: currentAsset.tyreSpecifications.pattern ?? '',
            loadIndex: currentAsset.tyreSpecifications.loadIndex ?? '',
            speedRating: currentAsset.tyreSpecifications.speedRating ?? '',
            plyRating: currentAsset.tyreSpecifications.plyRating ?? '',
            tubeType: currentAsset.tyreSpecifications.tubeType,
          },
        }
      : emptyValues,
  })

  useEffect(() => {
    form.reset(
      currentAsset
        ? {
            assetCode: currentAsset.assetCode,
            assetName: currentAsset.assetName,
            assetType: currentAsset.assetType,
            brand: currentAsset.brand,
            model: currentAsset.model,
            status: currentAsset.status,
            description: currentAsset.description ?? '',
            tyreSpecifications: {
              tyreSize: currentAsset.tyreSpecifications.tyreSize,
              construction: currentAsset.tyreSpecifications.construction,
              pattern: currentAsset.tyreSpecifications.pattern ?? '',
              loadIndex: currentAsset.tyreSpecifications.loadIndex ?? '',
              speedRating: currentAsset.tyreSpecifications.speedRating ?? '',
              plyRating: currentAsset.tyreSpecifications.plyRating ?? '',
              tubeType: currentAsset.tyreSpecifications.tubeType,
            },
          }
        : emptyValues
    )
  }, [currentAsset, form])

  const mutation = useMutation({
    mutationFn: (values: FleetAssetFormValues) =>
      isEdit && currentAsset
        ? updateFleetAsset(currentAsset.id, values)
        : createFleetAsset(values),
    onSuccess: async () => {
      toast.success(isEdit ? 'Asset updated.' : 'Asset created.')
      await queryClient.invalidateQueries({ queryKey: ['fleet-assets'] })
      form.reset(emptyValues)
      onOpenChange(false)
      closeDialog()
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const field = error.response?.data?.field
        const message = error.response?.data?.message

        if (field === 'assetCode' && typeof message === 'string') {
          form.setError('assetCode', { message })
          return
        }
      }

      handleServerError(error)
    },
  })

  const onSubmit = (values: FleetAssetFormValues) => {
    mutation.mutate(values)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          closeDialog()
          form.reset(emptyValues)
        }
        onOpenChange(state)
      }}
    >
      <DialogContent className='max-h-[92vh] overflow-hidden sm:max-w-4xl'>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Fleet Asset' : 'Add Fleet Asset'}</DialogTitle>
          <DialogDescription>
            Capture tyre asset details and specification data here.
          </DialogDescription>
        </DialogHeader>

        <div className='max-h-[72vh] overflow-y-auto pe-3'>
          <Form {...form}>
            <form id='fleet-asset-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <div className='grid gap-4 lg:grid-cols-2'>
                <div className='space-y-4 rounded-lg border p-4'>
                  <h3 className='text-base font-semibold'>Basic Information</h3>

                  <FormField
                    control={form.control}
                    name='assetCode'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Asset Code</FormLabel>
                        <FormControl>
                          <Input placeholder='TYR-001' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='assetName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Asset Name</FormLabel>
                        <FormControl>
                          <Input placeholder='295/80 R22.5' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='assetType'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Asset Type</FormLabel>
                        <SelectDropdown
                          defaultValue={field.value}
                          isControlled
                          onValueChange={field.onChange}
                          items={fleetAssetTypes.map((option) => ({
                            label: option.label,
                            value: option.value,
                          }))}
                          placeholder='Select asset type'
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='brand'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <FormControl>
                          <Input placeholder='MRF' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='model'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <FormControl>
                          <Input placeholder='Steel Muscle' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='status'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <SelectDropdown
                          defaultValue={field.value}
                          isControlled
                          onValueChange={field.onChange}
                          items={fleetAssetStatuses.map((option) => ({
                            label: option.label,
                            value: option.value,
                          }))}
                          placeholder='Select status'
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder='Optional note about the tyre asset.' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='space-y-4 rounded-lg border p-4'>
                  <h3 className='text-base font-semibold'>Tyre Specifications</h3>

                  <FormField
                    control={form.control}
                    name='tyreSpecifications.tyreSize'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tyre Size</FormLabel>
                        <FormControl>
                          <Input placeholder='295/80 R22.5' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='tyreSpecifications.construction'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Construction</FormLabel>
                        <SelectDropdown
                          defaultValue={field.value}
                          isControlled
                          onValueChange={field.onChange}
                          items={tyreConstructionOptions.map((option) => ({
                            label: option.label,
                            value: option.value,
                          }))}
                          placeholder='Select construction'
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='tyreSpecifications.pattern'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pattern</FormLabel>
                        <FormControl>
                          <Input placeholder='Steel Muscle' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='tyreSpecifications.loadIndex'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Load Index</FormLabel>
                        <FormControl>
                          <Input placeholder='152' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='tyreSpecifications.speedRating'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Speed Rating</FormLabel>
                        <FormControl>
                          <Input placeholder='M' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='tyreSpecifications.plyRating'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ply Rating</FormLabel>
                        <FormControl>
                          <Input placeholder='18 PR' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='tyreSpecifications.tubeType'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tube Type</FormLabel>
                        <SelectDropdown
                          defaultValue={field.value}
                          isControlled
                          onValueChange={field.onChange}
                          items={tyreTubeTypeOptions.map((option) => ({
                            label: option.label,
                            value: option.value,
                          }))}
                          placeholder='Select tube type'
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button type='submit' form='fleet-asset-form' disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
