import IMAP from 'imap-raw'

export default class TenIMAP extends IMAP {

}

const imap = new TenIMAP({
    host: 'imap.mail.ru',
    debug: true,
})

imap.send('LOGIN', {username: 'me@foxhable.ru', password: 'CKS1n4BV2fvtATibd7pu'})