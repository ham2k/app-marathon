/* eslint-disable no-unused-vars */
import React, { useState } from "react"

import { makeStyles } from "@mui/styles"
import classNames from "classnames"

import commonStyles from "../../../styles/common"

import { ENTITIES } from "@ham2k/data/cqww"
import { CQZONES } from "@ham2k/data/cqzones"

import { selectEntityGroups } from "../../../store/log"
import { useSelector } from "react-redux"
import { selectEntrySelections } from "../../../store/entries"
import { EntityEntry } from "./EntityEntry"

const CQWWEntities = Object.values(ENTITIES).sort((a, b) => {
  const attr = "entityPrefix"
  const aValue = a[attr][0] === "*" ? a[attr].slice(1) : a[attr]
  const bValue = b[attr][0] === "*" ? b[attr].slice(1) : b[attr]
  return aValue.localeCompare(bValue)
})

const CQZones = Object.keys(CQZONES)
  .map((k) => ({ ...CQZONES[k], zone: k, entityPrefix: `Zone ${k}` }))
  .sort((a, b) => a.zone - b.zone)

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
    minWidth: "100%",
    marginTop: "0.5em",
    "& th": {
      textAlign: "left",
      paddingRight: "1em",
    },
    "& td": {
      textAlign: "left",
      paddingRight: "1em",
    },

    "& .col-prefix": {
      textAlign: "center",
      maxWidth: "4em",
      whiteSpace: "nowrap",
    },
    "& .col-name": {
      minWidth: "5.5em",
    },
    "& .col-time": {
      minWidth: "5.5em",
    },
    "& .col-band": {
      textAlign: "right",
    },
    "& .col-call": {
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

export function EntityList({ qson }) {
  const [selectedPrefix, setSelectedPrefix] = useState("")
  const classes = useStyles()
  const entityGroups = useSelector(selectEntityGroups)
  const entrySelections = useSelector(selectEntrySelections)

  const counts = { entities: { qso: 0, qsl: 0, nil: 0 }, zones: { qso: 0, qsl: 0, nil: 0 } }

  CQWWEntities.forEach((entity) => {
    const key = entrySelections[entity.entityPrefix]
    const qsos = entityGroups[entity.entityPrefix] || []
    const entry = (key && qsos.find((qso) => qso.key === key)) || qsos[0]
    if (entry) {
      if (entry.qsl.sources.length > 0) {
        counts.entities.qsl += 1
      } else {
        counts.entities.qso += 1
      }
    } else {
      counts.entities.nil += 1
    }
  })

  CQZones.forEach((zone) => {
    const key = entrySelections[zone.entityPrefix]
    const qsos = entityGroups[zone.entityPrefix] || []
    const entry = qsos.find((qso) => qso.key === key) || qsos[0]
    if (entry) {
      if (entry.qsl.sources.length > 0) {
        counts.zones.qsl += 1
      } else {
        counts.zones.qso += 1
      }
    } else {
      counts.zones.nil += 1
    }
  })

  return (
    <>
      <h2>
        {counts.entities.qsl + counts.entities.qso} Entities
        {counts.entities.qso > 0 && <span>&nbsp;&nbsp;({counts.entities.qso} unconfirmed)</span>}
      </h2>
      <table className={classNames(classes.niceTable, classes.table, classes.bandColors)}>
        <thead>
          <tr>
            <th className="col-prefix">Prefix</th>
            <th className="col-name">Name</th>
            <th className="col-date">Date</th>
            <th className="col-band">Band</th>
            <th className="col-mode">Mode</th>
            <th className="col-call">Call</th>
            <th className="col-qsl">QSL</th>
            <th className="col-other">Other</th>
          </tr>
        </thead>
        <tbody>
          {CQWWEntities.map((entity, i) => (
            <EntityEntry
              key={entity.entityPrefix}
              entity={entity}
              num={i}
              qsos={entityGroups[entity.entityPrefix]}
              entryKey={entrySelections[entity.entityPrefix]}
              selectedPrefix={selectedPrefix}
              setSelectedPrefix={setSelectedPrefix}
            />
          ))}
        </tbody>
      </table>

      <h2>
        {counts.zones.qsl + counts.zones.qso} Entities
        {counts.zones.qso > 0 && <span>&nbsp;&nbsp;({counts.zones.qso} unconfirmed)</span>}
      </h2>
      <table className={classNames(classes.niceTable, classes.table, classes.bandColors)}>
        <thead>
          <tr>
            <th className="col-prefix">Prefix</th>
            <th className="col-name">Name</th>
            <th className="col-date">Date</th>
            <th className="col-band">Band</th>
            <th className="col-mode">Mode</th>
            <th className="col-call">Call</th>
            <th className="col-qsl">QSL</th>
            <th className="col-other">Other</th>
          </tr>
        </thead>
        <tbody>
          {CQZones.map((zone, i) => (
            <EntityEntry
              key={zone.entityPrefix}
              entity={zone}
              num={i}
              qsos={entityGroups[zone.entityPrefix]}
              entryKey={entrySelections[zone.entityPrefix]}
              selectedPrefix={selectedPrefix}
              setSelectedPrefix={setSelectedPrefix}
            />
          ))}{" "}
        </tbody>
      </table>
    </>
  )
}