import { Form, FormInstance } from "antd";

interface FormFieldErrorProps {
  form: FormInstance;
  name: string | (string | number)[];
}

// Renders a field's validation error as its own block, outside whatever
// bordered/boxed layout wraps the control — pair with a `noStyle` Form.Item
// around the control itself so antd doesn't also render the error inside the box.
const FormFieldError: React.FC<FormFieldErrorProps> = ({ form, name }) => (
  <Form.Item shouldUpdate noStyle>
    {() => {
      const error = form.getFieldError(name)[0];
      return error ? (
        <div className="text-red-500 text-xs mt-1">{error}</div>
      ) : null;
    }}
  </Form.Item>
);

export default FormFieldError;
