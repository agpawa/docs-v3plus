<template>
    <div>
        <img :src="src" class="thumb shadow-md" :style="thumbStyle"  @click="showLarge=true"/>
        <div class="note">{{note}}</div>
        <div class="fixed pin z-50 overflow-auto bg-smoke-light flex" v-if="showLarge" @click="showLarge=false">
            <img :src="src" class="relative bg-white max-w-md max-h-md m-auto flex-col flex shadow-md" @click="showLarge=false"/>
        </div>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                showLarge: false,
                zoomBoxX: 0,
                zoomBoxY: 0,
            }
        },
        props: {
            src: String,
            width: {
                type: [String,Number],
                default: '200px',
            },
            height: {
                type: [String,Number],
                default: 'auto',
            },
            note: {
                type: String,
                default: "Click to enlarge"
            }
        },
        computed: {
            thumbStyle() {
                let style = '';
                style += 'max-width: ' + this.width + ';';
                style += 'max-height: ' + this.height + ';';
                return style;
            }
        },
        methods: {},
    }

</script>

<style scoped>
    .thumb {
        cursor: zoom-in;
    }
    .note {
        margin-top: 4px;
        margin-bottom: 6px;
        color: #999;
        font-size: .8em;
        font-style: oblique;
    }

</style>