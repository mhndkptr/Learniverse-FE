import { Form } from '@/components/ui/form'

export default function BaseForm({
  children,
  formConfig,
  className,
  onSubmit,
  onError,
}) {
  const handleError = (errors) => {
    if (onError) {
      onError(errors)
    }
  }

  return (
    <Form {...formConfig}>
      <form
        onSubmit={formConfig.handleSubmit(onSubmit, handleError)}
        className={`${className}`}
      >
        {children}
      </form>
    </Form>
  )
}
