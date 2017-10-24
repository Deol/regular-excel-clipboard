/**
 * 自动聚焦元素 directive
 * @param {Object} elem
 */
export default {
    'r-autofocus': function(elem) {
        setTimeout(() => {
            elem.focus();
        }, 0);
    }   
};