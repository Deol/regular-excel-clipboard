
import REGUILAR from 'regularjs';
import template from './view.html';

import directive from '../../assets/directive';

const Modal = REGUILAR.extend({
    name: 'modal',
    template,
    init() {
        this.supr();

        // 如果不是内嵌组件，则嵌入到 document.body 中
        if (this.$root === this) {
            this.$inject(document.body);
        }
    },
    ok() {
        this.$emit('ok');
        this.close();
    },
    cancel() {
        this.$emit('cancel');
        this.close();
    },
    close() {
        this.$emit('close');
        this.destroy();
    }
}).directive(directive);

Modal.confirm = (text = '', subText = '', title = '', okButton = true, cancelButton = true) => {
    return new Modal({
        data: {
            text,
            subText,
            title,
            okButton,
            cancelButton
        }
    });
};

export default Modal;
