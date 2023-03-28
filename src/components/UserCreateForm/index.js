import { Formik, Field, Form } from "formik";
import axios from "axios";
import CSS from "./index.module.css"

function UserForm({done}) {
  const genders = [
    {value : 'Boş'},
    {value : 'Erkek'},
    {value : 'Kadın'},
  ]
  const fields = [
    {value : 'Yetişkin'},
    {value : 'Çocuk'},
  ]
  const registerUser = async ({name,gender,field, tcId}) => {
    const user = JSON.parse(localStorage.getItem('user'))
    try {
      const response = await axios.post('clients', {data: {
        name,
        gender,
        field,
        therapist: user,
        tc_id: tcId
      }})

      if (response) done ()

    } catch (error) {
      // toast.error (error?.message ?? 'error')
      console.log (error)
    }
  }
  return <div className={CSS["main-container"]}>
    <Formik
        initialValues={{
          // customerId: '',
          // password: '',
        }}
        // validationSchema={FormSchema}
        onSubmit={(values) => {
          registerUser (values)
        }}
      >
        {({ errors }) => (
          <Form>
            <div className={CSS["form-element"]}>
              <span // eslint-disable-next-line
              htmlFor="name">
                İsim
              </span>
              <div id="name" className={CSS.row}>
                <Field className={CSS["form-field"]} name="name"/>
              </div>
            </div>
            <div className={CSS["form-element"]}>
              <span // eslint-disable-next-line
              htmlFor="gender">
                Cinsiyet
              </span>
              <Field id="gender" className={CSS["form-field"]} as="select" name="gender">
                  {genders?.map (gender => <option key={gender.value} value={gender.value}>{gender.value}</option>)}
              </Field>
            </div>
            <div className={CSS["form-element"]}>
              <span // eslint-disable-next-line
              htmlFor="field">
                Alan
              </span>
              <Field id="field" className={CSS["form-field"]} as="select" name="field">
                  {fields?.map (field => <option key={field.value} value={field.value}>{field.value}</option>)}
              </Field>
            </div>
            {/* <div className={`${CSS["text-field"]} ${CSS["form-element"]}`}>
              <span // eslint-disable-next-line
              htmlFor="birthDate">
                Doğum Tarihi
              </span>
              <DatePickerField
                id="birthDate"
                name="birthDate"
                className={CSS["form-field"]}
                selected={birthDate}
                onChange={(date) => setBirthDate(date)}
                // timeClassName={handleColor}
              />
            </div> */}
            <div className={`${CSS["text-field"]} ${CSS["form-element"]}`}>
              <span // eslint-disable-next-line
              htmlFor="tc_id">
                T.C. Kimlik No.
              </span>
                <Field id="tc_id" type="number" name="tc_id" className={CSS["form-field"]} />
              {/* {errors.password && <p>{errors.password}</p>} */}
            </div>
            <button className={CSS["form-submit"]} type="submit">KAYDET</button>
          </Form>
        )}
      </Formik>
    </div>;
}
export default UserForm;