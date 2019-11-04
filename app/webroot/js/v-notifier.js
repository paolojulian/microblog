const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        .v-notifier {
            border-radius: 5px;
            margin: 1rem 0;
            background-color: #fafafa;
            color: #333333;
            padding: 1rem;
            box-shadow: 0 0 7px rgba(0, 0, 0, 0.30);
            border: 1px solid rgba(10, 10, 10, 0.25);
            display: flex;
            justify-content: flex-start;
        }
        .v-notifier:hover {
            transform: scale(1.05);
            border: 1px solid rgba(0, 0, 0, 0.50);
        }
        .body {
            flex: 1;
        }
        .close {
            cursor: pointer;
            color: #b00020;
        }
        .close:hover {
            color: #131313;
        }
        a {
            color: inherit;
            text-decoration: inherit;
        }
        .username {
            cursor: pointer;
            color: #eb5757;
            font-style: italic;
            font-size: 0.9rem;
            user-select: none;
            -webkit-user-drag: none;
            -khtml-user-drag: none;
            -moz-user-drag: none;
            -o-user-drag: none;
        }
        .text-link {
            cursor: pointer;
            color: #eb5757;
            text-align: right;
            font-size: 0.9rem;
            user-select: none;
            -webkit-user-drag: none;
            -khtml-user-drag: none;
            -moz-user-drag: none;
            -o-user-drag: none;
        }
    </style>
    <div class="v-notifier">
        <div class="body">
        </div>
        <div class="close"
            type="button"
        >
            &times;
        </div>
    </div>
`
class VNotifier extends HTMLElement {
    constructor () {
        super();
        this._shadow = this.attachShadow({ mode: 'open' });
        this._shadow.appendChild(template.content.cloneNode(true));
        this._host = this._shadow.host;
        this.body = this._shadow.querySelector('.v-notifier .body');
        this.closeBtn = this._shadow.querySelector('.close');

        this.timeout = null
    }

    connectedCallback () {
        this.closeBtn.addEventListener('click', this._close.bind(this));
        this._shadow.addEventListener('mouseover', () => clearTimeout(this.timeout))
        this._shadow.addEventListener('mouseout', this.requestTimeout.bind(this));
        this.requestTimeout();
    }

    disconnectedCallback () {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.closeBtn.removeEventListener('click', this._close.bind(this));
        this._shadow.removeEventListener('mouseover', () => clearTimeout(this.timeout))
        this._shadow.removeEventListener('mouseout', this.requestTimeout.bind(this))
    }

    requestTimeout () {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this._close();
        }, 5000);
    }

    set message (val) {
        this.body.innerHTML = val
    }

    _close () {
        this._host.parentNode.removeChild(this._host);
    }
}

customElements.define('v-notifier', VNotifier);