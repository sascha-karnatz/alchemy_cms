import { AlchemyHTMLElement } from "./alchemy_html_element"
import "@shoelace/dialog"

export class Dialog extends AlchemyHTMLElement {
  static properties = {
    size: { default: "400x300" },
    title: { default: "Dialog" },
    url: { default: undefined },
    removePadding: { default: false }
  }

  open() {
    if (this.url) {
      this.load(this.url).then((fetchedContent) => {
        this.dialog.innerHTML = fetchedContent
        this.dialog.show()
      })
    } else {
      this.dialog.show()
    }
  }

  close(callback) {
    if (typeof callback === "function") {
      this.addEventListener("sl-after-hide", callback)
    }
    this.dialog.hide()
  }

  connected() {
    this.addEventListener("sl-after-hide", () => this.remove())
  }

  /**
   * load content templates from the server
   * @param {string} url
   * @returns {Promise<string>}
   */
  async load(url) {
    const response = await fetch(url, {
      headers: { "X-Requested-With": "XMLHttpRequest" }
    })
    return await response.text()
  }

  render() {
    let style = `--width: ${this.width}px; --height: ${this.height}px`
    if (this.removePadding) {
      style += "; --body-spacing=0"
    }
    return `
      <sl-dialog label="${this.title}" class="dialog-overview" style="${style}">
        ${this.content}
      </sl-dialog>
    `
  }

  get dialog() {
    return this.getElementsByTagName("sl-dialog")[0]
  }

  get content() {
    return this.url
      ? `<alchemy-spinner></alchemy-spinner>`
      : this.initialContent
  }

  get height() {
    const maxHeight = this.dimension[1]
    const maxInnerHeight = window.innerHeight - 52 // Default Padding 16px - Header Height 36px

    return maxHeight < maxInnerHeight ? maxHeight : maxInnerHeight
  }

  get width() {
    const maxWidth = this.dimension[0]
    const maxInnerWidth = window.innerWidth - 16 // Default Padding 16px

    return maxWidth < maxInnerWidth ? maxWidth : maxInnerWidth
  }

  get dimension() {
    if (typeof this.size === "undefined" || this.size === "fullscreen") {
      return [undefined, undefined]
    }
    const size = this.size.split("x")
    return [parseInt(size[0], 10), parseInt(size[1], 10)]
  }
}

customElements.define("alchemy-dialog", Dialog)
