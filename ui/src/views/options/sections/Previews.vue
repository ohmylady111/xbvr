<template>
  <div class="container">
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
    <div class="content">
      <h3>{{$t("Previews")}}</h3>
      <hr/>
      <div class="columns">
        <div class="column">
          <section>
            <b-field :label="$t('Start time')">
              <div class="columns">
                <div class="column is-two-thirds">
                  <b-slider :min="5" :max="60" :step="5" :tooltip="false" v-model="startTime"></b-slider>
                </div>
                <div class="column">
                  <div class="content">{{startTime}}{{ $t('sec') }}</div>
                </div>
              </div>
            </b-field>
            <b-field :label="$t('Snippet length')">
              <div class="columns">
                <div class="column is-two-thirds">
                  <b-slider :min="0.2" :max="5" :step="0.2" :tooltip="false" v-model="snippetLength"></b-slider>
                </div>
                <div class="column">
                  <div class="content">{{snippetLength}}{{ $t('sec') }}</div>
                </div>
              </div>
            </b-field>
            <b-field :label="$t('Number of snippets')">
              <div class="columns">
                <div class="column is-two-thirds">
                  <b-slider :min="2" :max="40" :step="1" :tooltip="false" v-model="snippetAmount"></b-slider>
                </div>
                <div class="column">
                  <div class="content">{{snippetAmount}}</div>
                </div>
              </div>
            </b-field>
            <b-field>
              <b-checkbox v-model="extraSnippet">{{ $t('Grab extra snippet from the end of video') }}</b-checkbox>
            </b-field>
            <b-field :label="$t('Preview resolution')">
              <div class="columns">
                <div class="column is-two-thirds">
                  <b-slider :min="300" :max="800" :step="20" :tooltip="false" v-model="resolution"></b-slider>
                </div>
                <div class="column">
                  <div class="content">{{resolution}}px</div>
                </div>
              </div>
            </b-field>
            <b-field grouped>
              <b-button type="is-primary" @click="saveSettings" style="margin-right:1em">{{ $t('Save settings') }}</b-button>
              <b-button @click="testSettings">{{ $t('Test settings') }}</b-button>
            </b-field>
          </section>
          <hr/>
          <section>
            <p>
              {{ $t('Once you picked preview settings, you should start generating them.') }}
            </p>
            <p>
              {{ $t('BETA NOTE: Please note this is CPU-heavy process and once started, it could be stopped only by closing the app.') }}
            </p>
            <b-field>
              <b-button type="is-primary" @click="startGenerating">{{ $t('Start generating previews') }}</b-button>
            </b-field>
          </section>
        </div>
        <div class="column">
          <video v-if="isPreviewReady" :src="`/api/dms/preview/${previewFn}`" autoplay loop></video>
          <div v-if="generatingPreview">
            <div style="display: flex; flex-wrap: wrap;">
              <div class="bbox">
                <b-icon pack="fas" icon="sync-alt" custom-class="fa-spin"></b-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ky from 'ky'
import prettyBytes from 'pretty-bytes'

export default {
  name: 'Previews',
  data () {
    return {
      isLoading: true,
      startTime: 5,
      snippetLength: 0.2,
      snippetAmount: 2,
      resolution: 300,
      extraSnippet: false
    }
  },
  async mounted () {
    await this.loadState()
  },
  computed: {
    generatingPreview () {
      return this.$store.state.optionsPreviews.generatingPreview
    },
    isPreviewReady () {
      return this.$store.state.optionsPreviews.isPreviewReady
    },
    previewFn () {
      return this.$store.state.optionsPreviews.previewFn
    }
  },
  methods: {
    async loadState () {
      this.isLoading = true
      await ky.get('/api/options/state')
        .json()
        .then(data => {
          this.startTime = data.config.library.preview.startTime
          this.snippetLength = data.config.library.preview.snippetLength
          this.snippetAmount = data.config.library.preview.snippetAmount
          this.resolution = data.config.library.preview.resolution
          this.extraSnippet = data.config.library.preview.extraSnippet
          this.isLoading = false
        })
    },
    async saveSettings () {
      this.isLoading = true
      await ky.put('/api/options/previews', {
        json: {
          startTime: this.startTime,
          snippetLength: this.snippetLength,
          snippetAmount: this.snippetAmount,
          resolution: this.resolution,
          extraSnippet: this.extraSnippet
        }
      })
        .json()
        .then(data => {
          this.isLoading = false
        })
    },
    async testSettings () {
      this.$store.commit('optionsPreviews/hidePreview')
      await ky.post('/api/options/previews/test', {
        json: {
          startTime: this.startTime,
          snippetLength: this.snippetLength,
          snippetAmount: this.snippetAmount,
          resolution: this.resolution,
          extraSnippet: this.extraSnippet
        }
      })
    },
    async startGenerating () {
      await ky.get('/api/task/preview/generate')
    },
    prettyBytes
  }
}
</script>

<style scoped>
  video {
    width: 100%;
  }

  .bbox {
    flex: 1 0 calc(25% - 10px);
    margin: 5px;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .bbox:after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }
</style>
