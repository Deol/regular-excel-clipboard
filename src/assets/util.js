/**
 * Created by Aeo on 2017/10/21.
 */
const util = {};


/**
 * 判断剪贴板的数据可以转换成数据，还是仅为纯字符串
 * @param {String} data 
 */
util.isSimpleString = (str = '') => {
    return !/\t|\r\n?/g.test(str);
};
/**
 * 判断当前页面可操作区域中是否存在表格数据
 */
util.existTable = (clipboard, table) => {
    if(!clipboard || !table) {
        return false;
    }
    return [...clipboard.children].some((item ={}) => item === table);
};
/**
 * 获取页面中最新的表格数据，需要过滤单项多余空格和空白行
 */
util.getTableData = (clipboard, table) => {
    if(!clipboard || !table) {
        return [];
    }
    return [...util.existTable(clipboard, table) && table.getElementsByTagName('tr')].map((item = {}) => {
        return [...item.children].map(item => item.innerText.trim());
    }).filter((item = {}) => {
        return item.some(subItem => subItem !== '');
    });
};

export default util;