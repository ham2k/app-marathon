/* eslint-disable no-unused-vars */
import React, { useMemo } from "react"

import { makeStyles } from "@mui/styles"
import classNames from "classnames"

import commonStyles from "../../../styles/common"
import { fmtDateMonthYear } from "@ham2k/util/format"
import { fmtInteger, fmtOneDecimal } from "@ham2k/util/format"
import { camelCaseToTitleCase } from "@ham2k/util/format"

const useStyles = makeStyles((theme) => ({
  ...commonStyles(theme),

  root: {
    "& h2": {
      marginTop: "1em",
      borderBottom: "2px solid #333",
    },
  },

  table: {
    width: "inherit important!",
    marginTop: "0.5em",
    "& th": {
      textAlign: "left",
      paddingRight: "1em",
    },
    "& td": {
      textAlign: "left",
      paddingRight: "1em",
    },

    "& .col-number": {
      textAlign: "right",
      maxWidth: "4em",
    },
    "& .col-time": {
      minWidth: "5.5em",
    },
    "& .col-band": {
      textAlign: "right",
      fontWeight: "bold",
    },
    "& .col-freq": {
      textAlign: "right",
    },
    "& .col-cqz, & .col-ituz, & .col-exch-cqZone, & .col-exch-ituZone": {
      textAlign: "right",
    },
  },
}))

export function LogTable({ qson }) {
  const classes = useStyles()

  const qsos = useMemo(() => qson?.qsos || [], [qson])

  if (!qsos || qsos.length == 0) {
    return <div></div>
  }

  return (
    <table className={classNames(classes.niceTable, classes.table, classes.bandColors)}>
      <thead>
        <tr>
          <th className="col-number">#</th>
          <th className="col-time">Time</th>
          <th className="col-call">Call</th>
          <th className="col-band">Band</th>
          <th className="col-freq">Freq</th>
          <th className="col-prefix">Pre</th>
          <th className="col-entity">Entity</th>
          <th className="col-continent">Cont</th>
          <th className="col-cqz">CQZ</th>
          <th className="col-ituz">ITUZ</th>
        </tr>
      </thead>
      <tbody>
        {qsos.map((qso, i) => (
          <tr key={i} className={classNames(`band-${qso.band}`)}>
            <td className="col-number">{fmtInteger(qso.number)}</td>
            <td className="col-time">{fmtDateMonthYear(qso.startMillis)}</td>
            <td className="col-call">{qso.their.call}</td>
            <td className={classNames("col-band", "band-color")}>{qso.band}</td>
            <td className={classNames("col-freq", "band-color")}>{fmtInteger(qso.freq)}</td>
            <td className="col-prefix">{qso.their.entityPrefix}</td>
            <td className="col-entity">{qso.their.entityName}</td>
            <td className="col-continent">{qso.their.continent}</td>
            <td className="col-cqz">{qso.their.cqZone}</td>
            <td className="col-ituz">{qso.their.ituZone}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function exchangeLabel(key) {
  if (key === "cqZone") return "CQZ"
  else if (key === "ituZone") return "ITUZ"
  else return camelCaseToTitleCase(key)
}