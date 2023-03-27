import React from "react";
import { useField, useFormikContext } from "formik";
import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import tr from 'date-fns/locale/tr';

registerLocale('tr', tr)

export const DatePickerField = ({ ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);
  return (
    <DatePicker
      // do no change this magical order of props here!
      dateFormat='dd/MM/yyyy'
      {...field}
      {...props}
      locale="tr"
      showYearDropdown
      timeFormat='HH:mm'
      selected={(field.value && new Date(field.value)) || null}
      onChange={val => {
        setFieldValue(field.name, val);
      }}
    />
  );
};