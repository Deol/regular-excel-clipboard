/**
 * Created by Aeo on 2017/10/21.
 * Excel 纯前端复制粘贴组件，使用方式如下：
 * <Clipboard
 *     list={list}
 *     on-getInfo={this.getInfo($event)}
 * ></Clipboard>
 * list - 粘贴表格数据
 * on-getInfo - 获取粘贴表格数据
 */
import './mcss/index.mcss';

import REGULAR from 'regularjs';
import boardTpl from './view.html';

import Modal from './components/modal';

import ut from './assets/util';

let Clipboard = REGULAR.extend({
    template: '{#inc content}',
    $confirm(...args) {
        // 入参列表详见 ./components/modal.js
        return Modal.confirm(...args);
    },
    config(data) {
        this.supr(data);

        // 默认触发一次，生成空白的剪贴板
        this.updateClipboard(data.list || []);
    },
    /**
     * 更新操作区域的表格数据
     * @param {Array}   list 
     * @param {Boolean} concat
     * @param {Number}  reload
     */
    updateClipboard(list = [], concat = false, reload = Math.random()) {
        let { clipboard, table } = this.$refs;
        let prevList = ut.getTableData(clipboard, table);
        Object.assign(this.data, {
            list: concat ? prevList.concat(list) : list,
            content: `${boardTpl}<input type="hidden" data-reload=${reload} />`
        });
        this.$update();
    },
    /**
     * 获取剪贴板中的表格数据，并将其处理成可用的数据
     * @param {Object} e 
     */
    getClipboardData(e) {
        let clipboard = e.event.clipboardData;
        let data = clipboard.getData('text/plain').trim();
        if(ut.isSimpleString(data)) {
            return {
                type: 'string',
                data
            };
        }
        return {
            type: 'table',
            data: data.split((/\r\n?/g)).map((row) => {
                return row.split('\t').map(item => item.trim());
            }).filter((item) => {
                return item.some(subItem => !!subItem);
            })
        };
    },
    /**
     * 粘贴操作，对用户进行粘贴的数据进行处理
     * @param {Object} e 
     */
    paste(e) {
        let data = this.data;
        let { clipboard, table } = this.$refs;
        let excelInfo = this.getClipboardData(e);
        
        if(data.existConfirm) {
            e && e.preventDefault();
            return;
        }

        // 往表格中粘贴纯字符串时不做不做处理直接贴入，样式由单项的 contenteditable="plaintext-only" 去除
        if(excelInfo.type === 'string') {
            // 在输入框中粘贴字符串时直接阻止
            if([e.target, e.target.parentNode].indexOf(clipboard) > -1) {
                e && e.preventDefault();
                window.alert('只能粘贴Excel表格数据哦~');
            }
            return;
        }

        e && e.preventDefault();

        // 未设置过数据时直接贴入表格
        if(!ut.existTable(clipboard, table)) {
            this.updateClipboard(excelInfo.data);
            return;
        }

        // 避免 modal 未关闭时持续响应粘贴事件
        data.existConfirm = true;

        if(data.list[0].length === excelInfo.data[0].length) {
            this.$confirm('您是要拼接，还是直接覆盖现有的表格数据？', '拼接时无须粘贴表头哦~', '', '拼接', '覆盖')
                .$on('ok', () => {
                    this.updateClipboard(excelInfo.data, true);
                })
                .$on('cancel', () => {
                    this.updateClipboard(excelInfo.data);
                })
                .$on('close', () => {
                    data.existConfirm = false;
                });
        } else {
            this.$confirm('点击确认将覆盖已经设置过的表格数据哦~')
                .$on('ok', () => {
                    this.updateClipboard(excelInfo.data);
                }).$on('close', () => {
                    data.existConfirm = false;
                });
        }
    },
    /**
     * 实现数据导出
     */
    getInfo() {
        let { clipboard, table } = this.$refs;
        let elementList = ut.getTableData(clipboard, table) || [];
        // 列表不存在或长度小于 2，说明没有真实数据存在
        if(elementList.length < 2) {
            window.alert('请确定数据粘贴无误后再获取数据！');
            return;
        }
        // 输出值为可能经过用户处理后的纯二维数组
        this.$emit('getInfo', elementList);
    }
});

Clipboard.component('Modal', Modal);

// 将弹框组件挂载方便外部拓展
Clipboard.Modal = Modal;

module.exports = Clipboard;
