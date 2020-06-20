// https://jp.vuejs.org/v2/examples/todomvc.html
// ローカルストレージAPI
const STORAGE_KEY = 'todos-vuejs-demo'
const todoStorage = {
    fetch: function() {
        const todos = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || '[]'
        )
        todos.forEach(function(todo, index) {
            todo.id = index
        })
        todoStorage.uid = todos.length
        return todos
    },
    save: function(todos) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    }
}


// Vue.js
const app = new Vue({
    el: '#app',

    data: {
        // あらかじめからの配列を作る
        todos: [],
        // 選択用フォーム
        options: [
            { value: -1, label: 'すべて' },
            { value: 0, label: '作業中' },
            { value: 1, label: '完了' }
        ],
        // 初期値を「-1」にする
        current: -1
    },

    methods: {
        // 追加ボタンを押した時
        doAdd: function(event, value) {
            const comment = this.$refs.comment
                // コメントが空の時
            if (!comment.value.length) {
                return
            }
            // 配列に追加
            this.todos.push({
                    id: todoStorage.uid++,
                    comment: comment.value,
                    state: 0
                })
                // コメントを空にする
            comment.value = ''
        },
        // 状態の変化（完了or作業中）
        doChangeState: function(item) {
            item.state = item.state ? 0 : 1
        },
        // ToDoリストの削除
        doRemove: function(item) {
            const index = this.todos.indexOf(item)
            this.todos.splice(index, 1)
        }
    },

    watch: {
        // ストレージへの保存の自動化
        todos: {
            handler: function(todos) {
                todoStorage.save(todos)
            },
            deep: true // ネストしているデータも監視
        }
    },

    created() {
        // インスタンス作成時に自動的にfetch()する
        this.todos = todoStorage.fetch()
    },

    computed: {
        // currentが「-1」ならすべて
        // それ以外ならcurrentとstateが一致するものを返す
        computedTodos: function() {
            return this.todos.filter(function(el) {
                return this.current < 0 ? true : this.current === el.state
            }, this)
        },
        // キーから見つけやすいように、次のように加工したデータを作成
        // {0: '作業中', 1: '完了', -1: 'すべて'}
        labels() {
            return this.options.reduce(function(a, b) {
                return Object.assign(a, {
                    [b.value]: b.label })
            }, {})
        }
    }
})