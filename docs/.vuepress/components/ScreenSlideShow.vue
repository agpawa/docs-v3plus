<template>
    <div>
        <img :src="thumb" class="thumb shadow-md" :style="thumbStyle" @click="startSlideShow()" />
        <div class="note">{{note}}</div>

        <div class="fixed pin z-20 overflow-auto bg-smoke-light flex" v-if="showLarge" @click.stop="showLarge=false">

            <div class="relative m-auto flex-col text-center z-30 max-container-size" @click.stop="showLarge=true">

                <div class="nav-container flex content-between justify-end p-4">
                    <button class="rounded-full bg-grey-light items-center align-center flex w-8 h-8 mr-2" @click="previousSlide()">
                        <img src="/images/backward.svg" width="26" />
                    </button>
                    <button class="rounded-full bg-grey-light items-center align-center justify-center flex w-8 h-8" @click="nextSlide()">
                        <img src="/images/forward.svg" width="26" />
                    </button>
                </div>

                <div v-for="(slideInfo, index) in slideInfoArray" :key="index">
                    <transition name="slide-fade">
                        <div v-if="currentSlide == index" :key="index">
                            <img :src="slideInfo.img" @click="showLarge=false" />

                            <div class="bg-grey-darkest text-grey-lightest text-left p-4">
                                {{slideInfo.description}}
                            </div>
                        </div>
                    </transition>
                </div>

            </div>
        </div>
    </div>
</template>

<script>

import axios from 'axios';

export default {
    data() {
        return {
            showLarge: false,
            slideInfoArray: {},
            isLoaded: false,
            currentSlide: 0,
        }
    },
    props: {
        // Slideshow config JSON
        config: {
            type: String,
            required: true,  
        },
        thumb: {
            type: String,
            required: true,
        },
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
            default: "Click to view slide show"
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
    methods: {
        startSlideShow() {
            this.showLarge = true;
            this.currentSlide = 0;
        },
        nextSlide() {
            let lastSlideIndex = this.slideInfoArray.length - 1;
            if(this.currentSlide < lastSlideIndex) {
                this.currentSlide++;
            }                
        },
        previousSlide() {
            if(this.currentSlide > 0) {
                this.currentSlide--;
            } 
        },
        getConfig() {
            axios.get(this.config)
            .then(response => {
                this.slideInfoArray = response.data.slides;
                this.$nextTick(() => {
                    this.isLoaded = true;
                });
            })
        }
    },
    created() {
        this.getConfig();
    },
}

</script>

<style lang="scss" scoped>
.thumb {
  cursor: zoom-in;
}
.note {
  margin-top: 4px;
  margin-bottom: 6px;
  color: #999;
  font-size: 0.8em;
  font-style: oblique;
}

.max-container-size {
  max-width: 80vw;
}

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all 0.5s ease;
}
.slide-fade-leave-active {
  transition: all 0.5s ease;
}
.slide-fade-enter,
.slide-fade-leave {
  transform: translateX(100px);
  opacity: 0;
}
</style>