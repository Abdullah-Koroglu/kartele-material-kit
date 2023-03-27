import { useEffect, useState } from "react"
import axios from "axios"
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import groupBy from 'lodash/groupBy';
import moment from 'moment'
import 'moment/locale/tr'  // without this line it didn't work
import CSS from "./index.module.css"

moment.locale('tr')

const Calendar = () => {
  const [sessions, setSessions] = useState ([])
  const [rooms, setRooms] = useState ([])
  const [clients, setClients] = useState ([])
  const [dates, setDates] = useState ([new Date(moment().startOf('day')).getTime (), new Date(moment().startOf('day')).getTime ()])

  const getSessions = async () => {
    const sessions = await axios.get (`sessions?populate=*&sort[0]=start_time&filters[$and][0][start_time][$gte]=${dates[0]}&filters[$and][1][start_time][$lt]=${dates[1]}`)
    const clients = await axios.get (`clients?populate=*`)
    const rooms = await axios.get (`rooms`)
    const ordered = groupBy (sessions.data , ({attributes}) => attributes.room.data.attributes.color)
    const newObj = {}
    Object.keys(ordered).map (key => {
      // eslint-disable-next-line
      return newObj[key] = groupBy (ordered[key], function ({attributes}) {
        return moment(attributes.start_time).startOf('day').format('dddd');
      })
    })

    setSessions (newObj)
    setClients (clients.data)
    setRooms (rooms.data)
  }

  useEffect (() => {
    getSessions ()
  }, [dates] )

  return (
    <div className={CSS["main-container"]}>
      <ReactCalendar
        locale="tr-TR"
        className={CSS["calendar-main"]}
        onChange={(date) => setDates ([date.getTime (), date.getTime () + 86400000])}
        value={new Date (dates[0])}
        showWeekNumbers
        onClickWeekNumber={(weekNumber, date, event) => setDates ([date.getTime (), date.getTime () + (86400000 * 7)])}
      />
      {
        Object.keys(sessions)?.map (key => {
          const room =  sessions[key]
          return <div key={key} style={{backgroundColor: key}} className={CSS["room-container"]}>
            {
              Object.keys(room).map(day => {
                return <div key={day} className={CSS["day-container"]}>
                    <h3 className={CSS["room-name"]}>{rooms?.find ((room) => room?.attributes?.color === key)?.attributes?.name}</h3>
                    <span className={CSS["day-name"]}>{day}:</span>
                    <span className={CSS["program-container"]}>
                      {room[day].map(session => {
                        const client = clients.find((client) => client?.id === session.attributes.client?.data?.id)
                        return <div key={session.id} className={CSS["session-container"]}>
                          {`${client ? client?.attributes?.therapist?.data?.attributes?.username : 'Etkinlik'} ${dates[1] - dates[0] > 86400001 ? moment(session.attributes.start_time).format('MMMM Do YYYY') : ''} ${moment(session.attributes.start_time).format('HH:mm')} - ${moment(session.attributes.end_time).format('HH:mm')}
                          ` }
                        </div>
                      })}
                    </span>
                    </div>
              })
            }
          </div>
        })
      }
      {Object.keys(sessions)?.length === 0 ? 'Bugün için herhangi bir aktivite bulunmamaktadır.': null}
    </div>
  )

}

export default Calendar