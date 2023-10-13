import { Dialog } from "alchemy_admin/components/dialog"

export function closeCurrentDialog(callback) {
  const dialogs = document.querySelectorAll("alchemy-dialog")
  dialogs[dialogs.length - 1]?.close(callback)
}

/**
 * @param {string} url
 * @param {options} options
 */
export function openDialog(url, options = {}) {
  const dialog = new Dialog({ url, ...options })
  document.body.append(dialog)
  dialog.open()
}
