<template>
  <div class="container">
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
    <b-tabs v-model="activeTab" size="medium" type="is-boxed" style="margin-left: 0px" id="playertab">
      <b-tab-item :label="$t('Shared Settings')"/>
      <b-tab-item label="DeoVR"/>
      <b-tab-item label="Heresphere"/>
    </b-tabs>
    <div class="content" v-if="activeTab == 0">
      <h3>{{ $t('Shared Player Options') }}</h3>
      <hr/>
      <div class="columns">
        <div class="column">
          <section>
            <b-field :label="$t('Player integration')">
              <b-switch v-model="enabled">
                {{ $t('Enabled') }}
              </b-switch>
            </b-field>
            <hr/>
            <div v-if="enabled">
              <b-field :label="$t('Authentication')">
                <b-switch v-model="authEnabled">
                  {{ $t('Enabled') }}
                </b-switch>
              </b-field>
              <div class="block">
                <b-field grouped>
                  <b-field :label="$t('Username')">
                    <b-input v-model="username" :disabled="authEnabled === false" style="width:200px"></b-input>
                  </b-field>
                  <b-field :label="$t('Password')">
                    <b-input v-model="password" :disabled="authEnabled === false" style="width:200px" type="password"></b-input>
                  </b-field>
                </b-field>
              </div>
              <hr/>
              <div class="block">
                <b-field :label="$t('Funscript heatmaps')">
                  <b-switch v-model="renderHeatmaps">
                    {{ $t('Enabled') }}
                  </b-switch>
                </b-field>
                <p>
                  {{ $t('If you are using funscripts, you can add a heatmap to the thumbnails of scripted scenes in the Player interface.') }}
                </p>
              </div>
              <hr/>
              <div class="block">
                <b-field :label="$t('Watch time tracking')">
                  <b-switch v-model="watchTimeTrackingEnabled">
                    {{ $t('Enabled') }}
                  </b-switch>
                </b-field>
              </div>
              <hr/>
              <div class="block">
                <b-tooltip :label="$t('Specify fields if you wish to control the sequence of the scene\'s video files')" multilined :delay="750" >
                  <b-field :label="$t('Video File Sorting')">
                    <b-input v-model="videoSequence" disabled></b-input>
                  </b-field>
                  <b-field>
                    <b-button :label="$t('Add Field')" @click="addVideoField('video')" />
                    <b-button :label="$t('Clear Fields')" @click="videoSequence=''" />
                    <b-dropdown v-model="selectedVideoField" aria-role="list" :scrollable=true max-height="200">
                        <template #trigger>
                            <b-button :label="$t(selectedVideoField)" icon-right="menu-down"/>
                        </template>
                        <b-dropdown-item aria-role="listitem" value='Filename'>{{ $t('Filename') }}</b-dropdown-item>
                        <b-dropdown-item aria-role="listitem" value='Added'>{{ $t('Added') }}</b-dropdown-item>
                        <b-dropdown-item aria-role="listitem" value='Updated'>{{ $t('Updated') }}</b-dropdown-item>
                        <b-dropdown-item aria-role="listitem" value='Resolution'>{{ $t('Resolution') }}</b-dropdown-item>
                        <b-dropdown-item aria-role="listitem" value='Size'>{{ $t('Size') }}</b-dropdown-item>
                        <b-dropdown-item aria-role="listitem" value='Bitrate'>{{ $t('Bitrate') }}</b-dropdown-item>
                        <b-dropdown-item aria-role="listitem" value='Frame Rate'>{{ $t('Frame Rate') }}</b-dropdown-item>
                        <b-dropdown-item aria-role="listitem" value='Codec'>{{ $t('Codec') }}</b-dropdown-item>
                        <b-dropdown-item aria-role="listitem" value='Duration'>{{ $t('Duration') }}</b-dropdown-item>
                    </b-dropdown>
                    <b-dropdown v-model="selectedVideoSequence" aria-role="list">
                        <template #trigger>
                            <b-button :label="$t(selectedVideoSequence)" icon-right="menu-down" />
                        </template>
                        <b-dropdown-item aria-role="listitem" value='Ascending'>{{ $t('Ascending') }}</b-dropdown-item>
                        <b-dropdown-item aria-role="listitem" value='Descending'>{{ $t('Descending') }}</b-dropdown-item>
                    </b-dropdown>
                  </b-field>
                </b-tooltip>
                <b-tooltip :label="$t('Specify fields if you wish to control the sequence of the scene\'s script files')" multilined :delay="750" >
                  <b-field :label="$t('Script File Sorting')">
                    <b-input v-model="scriptSequence" disabled></b-input>
                  </b-field>
                  <b-field>
                    <b-button :label="$t('Add Field')" @click="addVideoField('script')" />
                    <b-button :label="$t('Clear Fields')" @click="scriptSequence=''" />
                    <b-dropdown v-model="selectedScriptField" aria-role="list">
                        <template #trigger>
                            <b-button :label="$t(selectedScriptField)" icon-right="menu-down" />
                        </template>
                        <b-dropdown-item aria-role="listitem" value='Filename'>{{ $t('Filename') }}</b-dropdown-item>
                        <b-dropdown-item aria-role="listitem" value='Added'>{{ $t('Added') }}</b-dropdown-item>
                        <b-dropdown-item aria-role="listitem" value='Updated'>{{ $t('Updated') }}</b-dropdown-item>
                        <b-dropdown-item aria-role="listitem" value='Selected'>{{ $t('Selected') }}</b-dropdown-item>
                    </b-dropdown>
                    <b-dropdown v-model="selectedScriptSequence" aria-role="list">
                        <template #trigger>
                            <b-button :label="$t(selectedScriptSequence)" icon-right="menu-down" />
                        </template>
                        <b-dropdown-item aria-role="listitem" value='Ascending'>{{ $t('Ascending') }}</b-dropdown-item>
                        <b-dropdown-item aria-role="listitem" value='Descending'>{{ $t('Descending') }}</b-dropdown-item>
                    </b-dropdown>
                  </b-field>
                </b-tooltip>
                <b-tooltip :label="$t('Specify fields if you wish to control the sequence of the scene\'s subtitle files')" multilined :delay="750" >
                  <b-field :label="$t('Subtitle File Sorting')">
                    <b-input v-model="subtitleSequence" disabled></b-input>
                  </b-field>
                  <b-field>
                    <b-button :label="$t('Add Field')" @click="addVideoField('subtitle')" />
                    <b-button :label="$t('Clear Fields')" @click="subtitleSequence=''" />
                    <b-dropdown v-model="selectedSubtitleField" aria-role="list">
                        <template #trigger>
                            <b-button :label="$t(selectedSubtitleField)" icon-right="menu-down" />
                        </template>
                        <b-dropdown-item aria-role="listitem" value='Filename'>{{ $t('Filename') }}</b-dropdown-item>
                        <b-dropdown-item aria-role="listitem" value='Added'>{{ $t('Added') }}</b-dropdown-item>
                        <b-dropdown-item aria-role="listitem" value='Updated'>{{ $t('Updated') }}</b-dropdown-item>
                        <b-dropdown-item aria-role="listitem" value='Selected'>{{ $t('Selected') }}</b-dropdown-item>
                    </b-dropdown>
                    <b-dropdown v-model="selectedSubtitleSequence" aria-role="list">
                        <template #trigger>
                            <b-button :label="$t(selectedSubtitleSequence)" icon-right="menu-down" />
                        </template>
                        <b-dropdown-item aria-role="listitem" value='Ascending'>{{ $t('Ascending') }}</b-dropdown-item>
                        <b-dropdown-item aria-role="listitem" value='Descending'>{{ $t('Descending') }}</b-dropdown-item>
                    </b-dropdown>
                  </b-field>
                </b-tooltip>
              </div>
            </div>
          </section>
        </div>
        <div class="column content">
          <p>
            {{ $t("Player interface is available at following URLs:") }}
          </p>
          <div>
            <h4 v-for="(addr, idx) in boundIp" :key="'ip' + idx">{{ addr }}</h4>
          </div>
          <hr/>
          <p>
            {{ $t('NOTE: make sure DeoVR is using') }} <strong>http://</strong> {{ $t('not') }} <strong>https://</strong>.<br/>
            {{ $t('To toggle used protocol, click on it in DeoVR\'s URL bar.') }}
          </p>
        </div>
      </div>
    </div>
    <div class="content" v-if="activeTab == 1">
      <h3>{{ $t('DeoVR interface') }}</h3>
      <hr/>
      <div class="block">
          <b-field :label="$t('Remote mode')">
            <b-switch v-model="remoteEnabled" :disabled="watchTimeTrackingEnabled === false">
              {{ $t('Enabled') }}
            </b-switch>
          </b-field>
          <p>
            {{ $t('Requires: Watch time tracking') }}
          </p>
          <p>
            {{ $t('To use remote mode, which enables more precise watch time tracking, you need to turn it on in DeoVR settings too - see') }} <a href="https://deovr.com/doc#remote-control" target="_blank" rel="noreferrer">
            {{ $t('instructions in DeoVR documentation') }}</a>.
          </p>
        </div>
    </div>
    <div class="content" v-if="activeTab == 2">
      <h3>{{ $t('Heresphere interface') }}</h3>
      <hr/>
          <b-tooltip
            :label="$t('WANRING: File deletion from Heresphere is PERMANENT! ALL files associated with a scene will be deleted.')"
            size="is-large" type="is-danger" multilined :delay="250" >
            <b-field :label="$t('Allow File Deletion')">
              <b-switch v-model="allowFileDeletions">
                {{ $t('Enabled') }}
              </b-switch>
            </b-field>
          </b-tooltip>
          <b-field :label="$t('Allow Ratings Updates')">
            <b-switch v-model="allowRatingUpdates">
              {{ $t('Enabled') }}
            </b-switch>
          </b-field>
          <b-field :label="$t('Allow Favorite Updates')">
            <b-switch v-model="allowFavouriteUpdates">
              {{ $t('Enabled') }}
            </b-switch>
          </b-field>
          <b-field :label="$t('Allow Tag Updates')">
            <b-switch v-model="allowTagUpdates">
              {{ $t('Enabled') }}
            </b-switch>
          </b-field>
          <b-field :label="$t('Allow Cuepoint Updates')">
            <b-switch v-model="allowCuepointUpdates">
              {{ $t('Enabled') }}
            </b-switch>
          </b-field>
          <b-tooltip
            :label="$t('Add or delete the Feature:watchlist tag to toggle the Watchlist flag in XBVR')"
            size="is-large" type="is-primary" multilined :delay="250" >
            <b-field :label="$t('Allow Watchlist Updates')">
              <b-switch v-model="allowWatchlistUpdates">
                {{ $t('Enabled') }}
              </b-switch>
            </b-field>
          </b-tooltip>
          <b-field :label="$t('Allow Saving Hsp Files')">
            <b-switch v-model="allowHspData">
              {{ $t('Enabled') }}
            </b-switch>
          </b-field>
          <div class="columns">
            <div class="column is-one-thrid">
              <b-tooltip
                :label="$t('This option will split Cuepoints into multiple tracks, eg Standing-Doggy will split into 2 tracks in Heresphere')"
                size="is-large" type="is-primary" multilined :delay="250" >
                <b-field :label="$t('Use Multi-Track Cuepoints')">
                  <b-switch v-model="multiTrackCuepoints">
                    {{ $t('Enabled') }}
                  </b-switch>
                </b-field>
              </b-tooltip>
            </div>
            <div class="column is-one-thrid">
              <b-tooltip
                :label="$t('This option will split Cuepoints matching the Actors Name into seperate tracks in Heresphere')"
                size="is-large" type="is-primary" multilined :delay="250" >
                <b-field :label="$t('Use Multi-Track Cast Cuepoints')">
                  <b-switch v-model="multiTrackCastCuepoints">
                    {{ $t('Enabled') }}
                  </b-switch>
                </b-field>
              </b-tooltip>
            </div>
            <div class="column is-one-thrid">
              <b-tooltip
                :label="$t('This option controls whether you use wish to keep existing non-HSP Cuepoints when you sync cuepoints changes. Syncing changes to Cuepoints in HSP will be saved with extended fields')"
                size="is-large" type="is-primary" multilined :delay="250" >
                <b-field :label="$t('Retain Non-HSP Cuepoints')">
                  <b-switch v-model="retainNonHSPCuepoints">
                    {{ $t('Enabled') }}
                  </b-switch>
                </b-field>
              </b-tooltip>
            </div>
          </div>
      </div>
      <b-field>
        <b-button type="is-primary" @click="save">{{ $t('Save and apply changes') }}</b-button>
      </b-field>
    </div>
</template>

<script>
export default {
  name: 'InterfaceDeoVR',
  mounted () {
    this.$store.dispatch('optionsDeoVR/load')
  },
  data () {
    return {
      activeTab: 0,
      selectedVideoField: 'Filename',
      selectedVideoSequence: 'Ascending',
      selectedScriptField: 'Filename',
      selectedScriptSequence: 'Ascending',
      selectedSubtitleField: 'Filename',
      selectedSubtitleSequence: 'Ascending'
    }
  },
  methods: {
    save () {
      this.$store.dispatch('optionsDeoVR/save')
    },
    addIP (value) {
      const tmp = [...this.allowedIp]
      tmp.push(value)

      if (!this.hasDuplicates(tmp)) {
        this.allowedIp = tmp
      }
    },
    hasDuplicates (array) {
      return (new Set(array)).size !== array.length
    },
    addVideoField(type) {
      let dbfield=''
      let field=this.selectedVideoField
      if (type=='script') {
        field=this.selectedScriptField
      } else if (type=='subtitle') {
        field=this.selectedSubtitleField
      }

      switch (field) {
        case 'Added':
          dbfield = 'created_time'
          break
        case 'Updated':
          dbfield = 'updated_time'
          break
        case 'Resolution':
          dbfield = 'video_height'
          break
        case 'Bitrate':
          dbfield = 'video_bit_rate'
          break
        case 'Frame Rate':
          dbfield = 'video_avg_frame_rate_val'
          break
        case 'Codec':
          dbfield = "case when video_codec_name in ('hevc', 'h265') then 0 when video_codec_name='h264' then 1 else 2 end"
          break
        case 'Duration':
          dbfield = 'video_direction'
          break
        case 'Selected':
          dbfield = 'is_selected_script'
          break
        default:
          dbfield = field.toLowerCase()
      }

      if (type=='video') {
        if (this.selectedVideoSequence=='Ascending') {
          this.videoSequence=[this.videoSequence, dbfield ].filter(Boolean).join(',')
        } else {
          this.videoSequence=[this.videoSequence, dbfield+' desc' ].filter(Boolean).join(',')
        }
      } else if (type=='script') {
        if (this.selectedScriptSequence=='Ascending') {
          this.scriptSequence=[this.scriptSequence, dbfield ].filter(Boolean).join(',')
        } else {
          this.scriptSequence=[this.scriptSequence, dbfield+' desc' ].filter(Boolean).join(',')
        }
      } else {
        if (this.selectedSubtitleSequence=='Ascending') {
          this.subtitleSequence=[this.subtitleSequence, dbfield ].filter(Boolean).join(',')
        } else {
          this.subtitleSequence=[this.subtitleSequence, dbfield+' desc' ].filter(Boolean).join(',')
        }
      }
    }
  },
  computed: {
    enabled: {
      get () {
        return this.$store.state.optionsDeoVR.deovr.enabled
      },
      set (value) {
        this.$store.state.optionsDeoVR.deovr.enabled = value
      }
    },
    authEnabled: {
      get () {
        return this.$store.state.optionsDeoVR.deovr.auth_enabled
      },
      set (value) {
        this.$store.state.optionsDeoVR.deovr.auth_enabled = value
      }
    },
    renderHeatmaps: {
      get () {
        return this.$store.state.optionsDeoVR.deovr.render_heatmaps
      },
      set (value) {
        this.$store.state.optionsDeoVR.deovr.render_heatmaps = value
      }
    },
    watchTimeTrackingEnabled: {
      get () {
        return this.$store.state.optionsDeoVR.deovr.track_watch_time
      },
      set (value) {
        this.$store.state.optionsDeoVR.deovr.track_watch_time = value
      }
    },
    remoteEnabled: {
      get () {
        return this.$store.state.optionsDeoVR.deovr.remote_enabled
      },
      set (value) {
        this.$store.state.optionsDeoVR.deovr.remote_enabled = value
      }
    },
    username: {
      get () {
        return this.$store.state.optionsDeoVR.deovr.username
      },
      set (value) {
        this.$store.state.optionsDeoVR.deovr.username = value
      }
    },
    password: {
      get () {
        return this.$store.state.optionsDeoVR.deovr.password
      },
      set (value) {
        this.$store.state.optionsDeoVR.deovr.password = value
      }
    },
    boundIp: {
      get () {
        return this.$store.state.optionsDeoVR.deovr.boundIp
      }
    },
    allowFileDeletions: {
      get () {
        return this.$store.state.optionsDeoVR.heresphere.allow_file_deletes
      },
      set (value) {
        this.$store.state.optionsDeoVR.heresphere.allow_file_deletes= value
      }
    },
    allowRatingUpdates: {
      get () {
        return this.$store.state.optionsDeoVR.heresphere.allow_rating_updates
      },
      set (value) {
        this.$store.state.optionsDeoVR.heresphere.allow_rating_updates = value
      }
    },
    allowFavouriteUpdates: {
      get () {
        return this.$store.state.optionsDeoVR.heresphere.allow_favorite_updates
      },
      set (value) {
        this.$store.state.optionsDeoVR.heresphere.allow_favorite_updates = value
      }
    },
    allowTagUpdates: {
      get () {
        return this.$store.state.optionsDeoVR.heresphere.allow_tag_updates
      },
      set (value) {
        this.$store.state.optionsDeoVR.heresphere.allow_tag_updates = value
      }
    },
    allowCuepointUpdates: {
      get () {
        return this.$store.state.optionsDeoVR.heresphere.allow_cuepoint_updates
      },
      set (value) {
        this.$store.state.optionsDeoVR.heresphere.allow_cuepoint_updates = value
      }
    },
    allowWatchlistUpdates: {
      get () {
        return this.$store.state.optionsDeoVR.heresphere.allow_watchlist_updates
      },
      set (value) {
        this.$store.state.optionsDeoVR.heresphere.allow_watchlist_updates = value
      }
    },
    allowHspData: {
      get () {
        return this.$store.state.optionsDeoVR.heresphere.allow_hsp_data
      },
      set (value) {
        this.$store.state.optionsDeoVR.heresphere.allow_hsp_data= value
      }
    },
    multiTrackCuepoints: {
      get () {
        return this.$store.state.optionsDeoVR.heresphere.multitrack_cuepoints
      },
      set (value) {
        this.$store.state.optionsDeoVR.heresphere.multitrack_cuepoints = value
      }
    },
    videoSequence: {
      get () {
        return this.$store.state.optionsDeoVR.players.video_sort_seq
      },
      set (value) {
        this.$store.state.optionsDeoVR.players.video_sort_seq = value
      },
    },
    scriptSequence: {
      get () {
        return this.$store.state.optionsDeoVR.players.script_sort_seq
      },
      set (value) {
        this.$store.state.optionsDeoVR.players.script_sort_seq = value
      },
    },
    subtitleSequence: {
      get () {
        return this.$store.state.optionsDeoVR.players.subtitle_sort_seq
      },
      set (value) {
        this.$store.state.optionsDeoVR.players.subtitle_sort_seq = value
      },
    },
    multiTrackCastCuepoints: {
      get () {
        return this.$store.state.optionsDeoVR.heresphere.multitrack_cast_cuepoints
      },
      set (value) {
        this.$store.state.optionsDeoVR.heresphere.multitrack_cast_cuepoints = value
      }
    },
    retainNonHSPCuepoints: {
      get () {
        return this.$store.state.optionsDeoVR.heresphere.retain_non_hsp_cuepoints
      },
      set (value) {
        this.$store.state.optionsDeoVR.heresphere.retain_non_hsp_cuepoints = value
      }
    },
    isLoading: function () {
      return this.$store.state.optionsDeoVR.loading
    },
    deoVROptions: function () {
      return this.$store.state.optionsDeoVR.deovr
    }
  }
}
</script>
