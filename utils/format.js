import moment from 'moment'
moment.locale('id')

export function formatFormDate (date) {
  if (!date && !moment(date).isValid()) {
    return null
  }
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}

export function parseFormDate (date) {
  if (!date) {
    return null
  }
  const [day, month, year] = date.split('/')
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

export function justNameFormat (data) {
  return data.first_name + ' ' + data.last_name
}

export function nameFormat (data) {
  let _firsttitle = (data.first_title === '') ? '' : data.first_title + ' '
  let _lasttitle = (data.last_title === '') ? '' : ', ' + data.last_title
  return _firsttitle + data.first_name + ' ' + data.last_name + _lasttitle
}

export function genderFormat (id) {
  return (id === 1) ? 'Laki-laki' : 'Perempuan'
}

export function nipFormat (nip) {
  return (nip === '') ? '-' : nip
}

export function addressFormat (address, postcode) {
  let _address = ''
  if (typeof postcode !== 'undefined') {
    _address = address.detail + ', ' + postcode.kelurahan
  }
  return _address
}

export function defaultDateFormat (date) {
  return moment(date).format('DD MMMM YYYY')
}

export function coderegStatusFormat (data) {
  return (data) ? 'Sudah Terdaftar' : 'Belum Terdaftar'
}

export function organizationStatusFormat (data) {
  return (data) ? 'Aktif' : 'Tidak Aktif'
}

export function organizationStructureStatusFormat (data) {
  return (data) ? 'Aktif' : 'Tidak Aktif'
}

export function appStatusFormat (data) {
  return (data) ? 'Aktif' : 'Tidak Aktif'
}

export function createdAtFormat (date) {
  return moment(date).format('DD MMMM YYYY')
}

export function objectFormat (value, key) {
  return (typeof value !== 'object') ? '' : value[key]
}

export function setValueText (object, key, isObject) {
  let output = ''
  if (typeof object !== 'undefined') {
    if (!isObject) {
      if (typeof object[key] !== 'undefined') {
        output = object[key]
      }
    } else {
      if (typeof object[key] === 'object') {
        output = object[key]
      }
    }
  }
  return output
}
