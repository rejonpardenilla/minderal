export const widgets = {
  text: {
    label: 'Text',
    icon: 'fa-solid fa-align-left',
    indexValue: true
  },
  folder: {
    label: 'Folder',
    icon: 'fa-solid fa-folder',
    indexValue: false
  },
  link: {
    label: 'Link',
    icon: 'fa-solid fa-link',
    indexValue: true
  },
  checkbox: {
    label: 'Checkbox',
    icon: 'fa-solid fa-square-check',
    indexValue: false,
    defaultValue: false
  },
  audio: {
    label: 'Audio',
    icon: 'fa-solid fa-microphone',
    indexValue: false
  },
  counter: {
    label: 'Counter',
    icon: 'fa-solid fa-plus-minus',
    indexValue: false
  },
  countdown: {
    label: 'Countdown',
    icon: 'fa-solid fa-hourglass-half',
    indexValue: false
  },
  todo: {
    label: 'To-do',
    icon: 'fa-solid fa-square-check',
    indexValue: false
  }
}

export const getWidgetList = () => {
  return Object.entries(widgets).map((type) => {
    return { index: type[0], ...type[1] }
  })
}
