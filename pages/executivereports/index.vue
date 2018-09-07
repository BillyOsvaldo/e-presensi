<template>
  <v-layout row wrap class="executivereports">
		<v-flex xs12>
      <div class="_date">
        <span>{{ today }}</span>
      </div>
    </v-flex>
    <v-flex xs12 sm12 md12 lg7 style="padding:12px 24px;">
      <v-container grid-list-md>
        <v-layout row wrap v-bind="itemRealtime + itemRealtimeOrganization">
    			<v-flex xs12 sm12 md12 lg7>
            <v-card color="grey darken-2" class="white--text">
                <v-container fluid grid-list-lg>
                  <v-layout row>
                    <v-flex xs12>
                      <div>
                        <v-icon style="float: left;margin-right: 16px;" x-large>fingerprint</v-icon>
                        <div class="headline">{{ (idOrganization) ? 'Real-time Presensi' : 'Persentasi Kehadiran' }}</div>
                        <div>{{ (idOrganization) ? nameOrganization : 'Semua Organisasi' }}</div>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-container>
                <v-container class="listofrealtime" fluid grid-list-lg>
                  <v-layout row v-if="(itemRealtimeOrgList.length === 0)">
                    <v-flex xs12>
                      <div v-if="(itemRealtimeList.length === 0) ? true : false" style="color: #000;text-align: center;">Data Belum Ada.</div>
                      <v-list subheader>
        			          <v-list-tile avatar v-for="item in itemRealtimeList" :key="item._id">
        			            <v-list-tile-content>
        			              <v-list-tile-title v-html="item.name"></v-list-tile-title>
                            <v-list-tile-sub-title>{{ (item.mode === 1) ? 'Masuk' : 'Pulang' }}</v-list-tile-sub-title>
        			            </v-list-tile-content>
        			            <v-list-tile-action>
        			              <span style="font-weight: bold;">{{ timeRealtime(item.time) }}</span>
        			            </v-list-tile-action>
        			          </v-list-tile>
        			        </v-list>
                    </v-flex>
                  </v-layout>
                  <v-layout row v-if="(itemRealtimeList.length === 0)">
                    <v-flex xs12> 
                      <div v-if="(itemRealtimeOrgList.length === 0) ? true : false" style="color: #000;text-align: center;">Data Belum Ada.</div>
                      <v-list subheader>
                        <v-list-tile avatar :to="('executivereports/' + item._id)" v-for="item in itemRealtimeOrgList" :key="item._id">
                          <v-list-tile-content>
                            <v-list-tile-title v-html="item.name"></v-list-tile-title>
                          </v-list-tile-content>
                          <v-list-tile-action>
                            <v-chip color="primary" text-color="white"><span style="font-weight: bold; font-size: 14px;">
                              {{ formatPercentOrga(item.summary) }}
                            </span></v-chip>
                          </v-list-tile-action>
                        </v-list-tile>
                      </v-list>
                    </v-flex>
                  </v-layout>
                </v-container>
            </v-card>
          </v-flex>
          <v-flex xs12 sm12 md12 lg5>
            <v-layout row wrap>
              <v-flex xs12 sm12 md12 lg12>
                <v-card color="red darken-2" class="white--text">
                  <v-container fluid grid-list-lg class="countTotal">
                    <v-layout row>
                      <v-flex xs12>
                        <div>
                          <div class="_titlecount">Tepat Waktu</div>
                          <div class="_totalcount">{{ formatOutput(tepatwaktu) }}</div>
                          <v-icon style="position: absolute;top: 16px;right: 16px;" x-large>alarm_on</v-icon>
                          <v-divider></v-divider>
                          <span class="_infocount">Total Datang Tepat Waktu</span>
                        </div>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card>
              </v-flex>
              <v-flex xs12 sm12 md12 lg12>
                <v-card color="orange darken-2" class="white--text">
                  <v-container fluid grid-list-lg class="countTotal">
                    <v-layout row>
                      <v-flex xs12>
                        <div>
                          <div class="_titlecount">Terlambat</div>
                          <div class="_totalcount">{{ formatOutput(terlambat) }}</div>
                          <v-icon style="position: absolute;top: 16px;right: 16px;" x-large>alarm</v-icon>
                          <v-divider></v-divider>
                          <span class="_infocount">Total Datang Terlambat</span>
                        </div>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card>
              </v-flex>
              <v-flex xs12 sm12 md12 lg12>
                <v-card color="green darken-2" class="white--text">
                  <v-container fluid grid-list-lg class="countTotal">
                    <v-layout row>
                      <v-flex xs12>
                        <div>
                          <div class="_titlecount">Belum Datang</div>
                          <div class="_totalcount">{{ formatOutput(belumdatang) }}</div>
                          <v-icon style="position: absolute;top: 16px;right: 16px;" x-large>alarm_off</v-icon>
                          <v-divider></v-divider>
                          <span class="_infocount">Total Belum Datang</span>
                        </div>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
		</v-flex>
    <v-flex xs12 sm12 md12 lg5 style="padding:24px;">
      <div style="margin: 0 8px 8px;">
        <div class="headline2">Ketidakhadiran</div>
        <div>{{ (idOrganization) ? nameOrganization : 'Semua Organisasi' }}</div>
      </div>
      <v-container grid-list-md>
        <v-layout row wrap>
          <v-flex xs12 sm12 md6 lg6>
            <v-card color="purple darken-2" class="white--text">
              <v-container fluid grid-list-lg class="countTotal2">
                <v-layout row>
                  <v-flex xs12>
                    <div>
                      <div class="_titlecount">Dinas Luar</div>
                      <div class="_totalcount">{{ formatOutput(dinasluar) }}</div>
                      <v-icon style="position: absolute;top: 16px;right: 16px;" x-large>work</v-icon>
                      <v-divider></v-divider>
                      <span class="_infocount">Total Pegawai Dinas Luar</span>
                    </div>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </v-flex>
          <v-flex xs12 sm12 md6 lg6>
            <v-card color="cyan darken-2" class="white--text">
              <v-container fluid grid-list-lg class="countTotal2">
                <v-layout row>
                  <v-flex xs12>
                    <div>
                      <div class="_titlecount">Izin</div>
                      <div class="_totalcount">{{ formatOutput(izin) }}</div>
                      <v-icon style="position: absolute;top: 16px;right: 16px;" x-large>weekend</v-icon>
                      <v-divider></v-divider>
                      <span class="_infocount">Total Pegawai Izin</span>
                    </div>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </v-flex>
          <v-flex xs12 sm12 md6 lg6>
            <v-card color="yellow darken-2" class="white--text">
              <v-container fluid grid-list-lg class="countTotal2">
                <v-layout row>
                  <v-flex xs12>
                    <div>
                      <div class="_titlecount">Sakit</div>
                      <div class="_totalcount">{{ formatOutput(sakit) }}</div>
                      <v-icon style="position: absolute;top: 16px;right: 16px;" x-large>local_hospital</v-icon>
                      <v-divider></v-divider>
                      <span class="_infocount">Total Pegawai Sakit</span>
                    </div>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </v-flex>
          <v-flex xs12 sm12 md6 lg6>
            <v-card color="pink darken-2" class="white--text">
              <v-container fluid grid-list-lg class="countTotal2">
                <v-layout row>
                  <v-flex xs12>
                    <div>
                      <div class="_titlecount">Cuti</div>
                      <div class="_totalcount">{{ formatOutput(cuti) }}</div>
                      <v-icon style="position: absolute;top: 16px;right: 16px;" x-large>tag_faces</v-icon>
                      <v-divider></v-divider>
                      <span class="_infocount">Total Pegawai Cuti</span>
                    </div>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
  import api from '~/api/feathers-client'
  import {mapGetters} from 'vuex'
  import moment from 'moment'
  moment.locale('id')
  export default {
    data: () => ({
      currentTime: null,
      itemRealtimeList: [],
      itemRealtimeOrgList: [],
      total: 0,
      tepatwaktu: 0,
      terlambat: 0,
      belumdatang: 0,
      dinasluar: 0,
      izin: 0,
      cuti: 0,
      sakit: 0,
      tepatwaktuorg: 0,
      terlambatorg: 0,
      totalorg: 0,
      idOrganization: null,
      nameOrganization: ''
    }),
    computed: {
      ...mapGetters({
        'user': 'usersauthentication/current',
        'presencestodaysummary': 'presencestodaysummary/list',
        'presencestoday': 'presencestoday/list',
        'presencesOrg': 'presencestodayorganizations/list'
      }),
      today () {
        return moment().format('dddd, DD MMMM YYYY')
      },
      itemRealtime () {
        if (this.presencestoday.length > 0 && this.idOrganization) {
          this.itemRealtimeList = this.presencestoday
        }
      },
      itemRealtimeOrganization () {
        if (this.presencesOrg.length > 0) {
          this.itemRealtimeOrgList = this.presencesOrg
        }
      }
    },
    methods: {
      timeRealtime (time) {
        return moment(time).format('HH:mm')
      },
      initSetDefault () {
        let params = {}
        if (this.idOrganization) {
          params = {
            query: {
              organization: this.idOrganization
            }
          }
        }
        this.$store.dispatch('presencestodaysummary/find', params)
          .then(response => {
            this.total = response.data[0].total
            this.tepatwaktu = response.data[0].tepat_waktu
            this.terlambat = response.data[0].terlambat
            this.dinasluar = response.data[0].dinas_luar
            this.izin = response.data[0].izin
            this.cuti = response.data[0].cuti
            this.sakit = response.data[0].sakit
            this.belumdatang = (this.total - response.data[0].tepat_waktu - response.data[0].terlambat - this.dinasluar - this.izin - this.cuti - this.sakit)
            // console.log(this.total)
          })
      },
      realtimeFinger () {
        if (this.idOrganization) {
          let _on = 'organization_' + this.idOrganization
          api.service('presences').on(_on, (doc) => {
            let _user = this.itemRealtimeList.find((item) => item.user === doc.user)
            if (_user) {
              if (_user.mode !== doc.mode) {
                this.itemRealtimeList.unshift(doc)
              }
            } else {
              this.itemRealtimeList.unshift(doc)
            }
          })
        }
      },
      fingerToday () {
        if (this.idOrganization) {
          let params = {
            query: {
              organization: this.idOrganization,
              $sort: {
                time: -1
              }
            }
          }
          this.$store.dispatch('presencestoday/find', params)
        }
      },
      realtimeTepatWaktu () {
        if (this.idOrganization) {
          let _on = 'organization_' + this.idOrganization + '_tepat_waktu'
          api.service('presences').on(_on, (doc) => {
            this.tepatwaktu++
            this.belumdatang--
          })
        } else {
          api.service('presences').on('tepat_waktu', (doc) => {
            this.tepatwaktu++
            this.belumdatang--
            let item = this.itemRealtimeOrgList.find(i => i._id === doc.organization).summary
            item.tepat_waktu++
            item.belum_datang--
          })
        }
      },
      realtimeTerlambat () {
        if (this.idOrganization) {
          let _on = 'organization_' + this.idOrganization + '_terlambat'
          api.service('presences').on(_on, (doc) => {
            this.terlambat++
            this.belumdatang--
          })
        } else {
          api.service('presences').on('terlambat', (doc) => {
            this.terlambat++
            this.belumdatang--
            let item = this.itemRealtimeOrgList.find(i => i._id === doc.organization).summary
            item.terlambat++
            item.belum_datang--
          })
        }
      },
      formatOutput (data) {
        if (this.idOrganization) {
          return data
        } else {
          return (data / this.total * 100).toFixed(1) + '%'
        }
      },
      formatPercentOrga (data) {
        return ((data.tepat_waktu + data.terlambat) / data.total * 100).toFixed(1) + '%'
      },
      organizationPresences () {
        if (!this.idOrganization) {
          this.$store.dispatch('presencestodayorganizations/find', {})
        }
      }
    },
    created () {
      if (this.user.organization) {
        this.idOrganization = this.user.organization._id
        this.nameOrganization = this.user.organization.name
      } else {
        this.idOrganization = this.$route.params.id
      }
      this.initSetDefault()
      this.fingerToday()
      this.realtimeTepatWaktu()
      this.realtimeTerlambat()
      this.realtimeFinger()
      this.organizationPresences()
      this.$store.dispatch('setNavigationCount', 0)
      this.$store.dispatch('setBreadcrumbs', [])
    }
  }
</script>
<style lang="sass" scoped>
.executivereports
  background: #fff
  overflow-y: scroll
  height: calc(100vh - 300px)
</style>
<style lang="sass">
._date
  font-size: 20px
  margin: 18px 32px 0
.listofrealtime
  background: #fff
  height: 360px
  overflow: scroll
  padding: 16px 0
  .v-list
    a
      padding: 0 16px
    .v-list__tile
      padding: 0px 16px
.countTotal
  height: 146px
._titlecount
  font-size: 16px
  margin-bottom: 4px
  line-height: 20px
  font-weight: bold
._totalcount
  font-size: 56px
  line-height: 64px
._infocount
  font-size: 12px
  margin: 8px 0
  display: block
.headline2
  font-size: 30px !important
  font-weight: 400
  line-height: 40px!important
  letter-spacing: normal!important
.countTotal2
  height: 146px
</style>