import axios from 'axios';
import { useContext, useEffect, useState } from 'react'
import { IoArrowBackCircleOutline } from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import moment from 'moment/moment';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { convertToHTML } from 'draft-convert';
import { toast } from "react-toastify";

import RichTextEditor from '../../components/RichText/RichText';
import CSS from './index.module.css'

const SessionDetail = () => {
  const [session, setSession] = useState();
  const [notes, setNotes] = useState()
  const [isPaid, setIsPaid] = useState()
  const [isCompleted, setIsCompleted] = useState()
  const { id } = useParams()

  const getSession = async () => {
    const session = await axios.get(`sessions/${id}?populate[0]=client&populate[1]=session_type`)
    setNotes(session.data.attributes.notes === null ? '' : session.data.attributes.notes)
    setIsPaid(session.data.attributes.is_paid)
    setIsCompleted(session.data.attributes.is_completed)
    setSession(session.data.attributes)
  }

  const updateSession = async () => {
    try {
      const session = await axios.put(`sessions/${id}`, { data: { is_paid: isPaid, is_completed: isCompleted, notes } })
      if (session?.error) {
        try {
          toast.error(session?.error?.message ?? 'error')
        } catch (error) {
          console.log(session.error)
        }
      }
      toast.success('Başarıyla güncellendi!')
    } catch (error) {
      console.log(error)
    }


  }

  const changeIs = (param) => {
    if (param === true) {
      return false
    }
    return true
  }

  useEffect(() => {
    getSession()
  }, [])

  return <div className={CSS["main-container"]}>
    {session ? <div className={CSS["inner-container"]}>
      <div className={CSS['attribute-row']}><b>Kategori:</b> <span className={CSS.answer}>{session.session_type?.data?.attributes?.name}</span></div>
      <div className={CSS['attribute-row']}><b>Danışan:</b> <span className={CSS.answer}>{session.client?.data?.attributes?.name}</span></div>
      <div className={CSS['attribute-row']}><b>Tarih:</b> <span className={CSS.answer}>{moment(session.start_time).format('Do MMMM YYYY - HH:mm:ss')}</span></div>
      <div className={CSS['attribute-row']}><b>Ücter:</b> <span className={CSS.answer}>{session.price} ₺</span></div>
      <div className={CSS['attribute-row']}><b>Ödendi mi? :
      </b><div // eslint-disable-line
        onClick={() => { setIsPaid(changeIs(isPaid)) }}
        onKeyDown={() => { setIsPaid(changeIs(isPaid)) }}
        className={CSS['is-attribute']}>
          {isPaid === true ? <FaCheck color="#50C878" /> : isPaid === false ? <FaTimes color="#f44336" /> : null}
        </div>
      </div>
      <div className={CSS['attribute-row']}><b>Tamamlandı mı? :</b>
        <div // eslint-disable-line
         onClick={() => { setIsCompleted(changeIs(isCompleted)) }}
         onKeyDown={() => { setIsCompleted(changeIs(isCompleted)) }}
         className={CSS['is-attribute']}>
          {isCompleted === true ? <FaCheck color="#50C878" /> : isCompleted === false ? <FaTimes color="#f44336" /> : null}
        </div>
      </div>
      <div className={CSS['note-row']}><b>Notlar :</b> {notes || notes === '' ?
        <div className={CSS['summer-note']}>
          <RichTextEditor value={notes} onChange={(a) => { setNotes(convertToHTML(a.getCurrentContent())) }} />
        </div> : null
      }
      </div>
      <div className={CSS['attribute-row']}><button className={CSS["form-submit"]} onClick={() => { updateSession(); }}>KAYDET</button></div>
    </div> : null}
  </div>
}

export default SessionDetail