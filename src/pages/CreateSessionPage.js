import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
// @mui
import { Container, Typography } from '@mui/material';
// components
import { toast } from "react-toastify";
import { AiOutlineUserAdd } from 'react-icons/ai'
import { Formik, Form, Field } from "formik";
import Calendar from '../components/calendar';
import Modal from "../components/Modal";
import UserCreateForm from "../components/UserCreateForm";
import { DatePickerField } from "../components/FormikDatePicker";

import CSS from "./index.module.css"

// ----------------------------------------------------------------------

export default function CreateSessionPage() {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState([])
  const [sessionTypes, setSessionTypes] = useState([])
  const [startDate, setStartDate] = useState()
  const [clients, setClients] = useState()
  const [modalOpen, setModalOpen] = useState()

  const getFormData = async () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const rooms = await axios.get('rooms')
    const sessionTypes = await axios.get('session-types?filters[is_for_event]=false')
    const clients = await axios.get(`clients?filters[$and][0][therapist][id]=${user.id}&filters[$and][1][active][$ne]=false&populate=*`)

    setSessionTypes(sessionTypes?.data)
    setRooms(rooms?.data)
    setClients(clients?.data)
  }

  const submitSession = async ({ client, room, startTime, duration, price, sessionType }) => {
    try {
      const endTime = new Date(startTime.getTime() + (duration * 60000)).getTime()

      const response = await axios.post('sessions/check_and_create', {
        data: {
          client,
          room,
          start_time: startTime.getTime(),
          end_time: endTime,
          price,
          session_type: sessionType
        }
      })
      if (response?.error) {
        toast.error(response.error?.message ?? 'error')
        return
      }
      if (response?.message) {
        toast.error(response.message ?? 'error')
        return
      }
      if (response) {navigate ('/my_sessions')}
      else {
        toast.error('error')
        return
      }

    } catch (error) {
      toast.error(error?.message ?? 'error')
      console.log({ error })
    }
  }

  const handleCloseModal = (e) => {
    console.log ('asdf')
    setModalOpen(); getFormData()
  }

  useEffect (() => {
    getFormData ()
  }, [])

  return (
    <>
      <Helmet>
        <title> Seans Ekle | Kartela Psikoloji </title>
      </Helmet>

      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Seans Ekle
        </Typography>

        <div className={CSS["main-container"]}>
          <Modal setOpenFromParent={(e) => { handleCloseModal(e) }} open={modalOpen}>{<UserCreateForm done={() => handleCloseModal()} />}</Modal>
          <div className={CSS["form-container"]}>
            <Formik
              initialValues={{
                // customerId: '',
                // password: '',
              }}
              // validationSchema={FormSchema}
              onSubmit={(values) => {
                submitSession(values)
              }}
            >
              {({ errors }) => (
                <Form>
                  <div className={CSS["form-element"]}>
                    <span>
                      Danışan
                    </span>
                    <div className={CSS.row}>
                      <Field className={CSS["form-field"]} as="select" name="client">
                        <option value={-1}>Seçiniz</option>
                        {clients?.map(client => <option key={client.id} value={client.id}>{client.attributes.name}</option>)}
                      </Field>
                      <AiOutlineUserAdd onClick={() => { setModalOpen(true) }} size={'1.5rem'} className={CSS["add-user-icon"]} />
                    </div>
                  </div>
                  <div className={CSS["form-element"]}>
                    <span>
                      Oda
                    </span>
                    <Field className={CSS["form-field"]} as="select" name="room">
                      <option value={-1}>Seçiniz</option>
                      {rooms?.map(room => <option key={room.id} value={room.id}>{room.attributes.name}</option>)}
                    </Field>
                  </div>
                  <div className={`${CSS["text-field"]} ${CSS["form-element"]}`}>
                    <span>
                      Başlangıç
                    </span>
                    <DatePickerField
                      // autoComplete="off"
                      name="startTime"
                      className={CSS["form-field"]}
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      showTimeInput
                      dateFormat='dd/MM/yyyy HH:mm'
                    // timeClassName={handleColor}
                    />
                    {/* {errors.password && <p>{errors.password}</p>} */}
                  </div>
                  <div className={`${CSS["text-field"]} ${CSS["form-element"]}`}>
                    <span>
                      Süre (dakika)
                    </span>
                    <Field type="number" name="duration" className={CSS["form-field"]} />
                  </div>
                  <div className={`${CSS["text-field"]} ${CSS["form-element"]}`}>
                    <span>
                      Ücret (₺)
                    </span>
                    <Field type="number" name="price" className={CSS["form-field"]} />
                    {/* {errors.password && <p>{errors.password}</p>} */}
                  </div>
                  <div className={CSS["form-element"]}>
                    <span>
                      Kategori
                    </span>
                    <Field className={CSS["form-field"]} as="select" name="session_type">
                      <option value={-1}>Seçiniz</option>
                      {sessionTypes?.map(type => <option key={type.id} value={type.id}>{type.attributes.name}</option>)}
                    </Field>
                  </div>
                  <button className={CSS["form-submit"]} type="submit">KAYDET</button>
                </Form>
              )}
            </Formik>

          </div>
          <div className={CSS["calendar-container"]}>{Calendar()}</div>
        </div>
      </Container>
    </>
  );
}
