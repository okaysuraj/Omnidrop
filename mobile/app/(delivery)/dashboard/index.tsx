import {
  BrutalBadge,
  BrutalButton,
  BrutalCard,
  BrutalTelemetryStrip,
} from '@/components/brutal-ui';
import { BrutalColors } from '@/constants/theme';
import { styles } from '@/features/delivery/dashboard.styles';
import { useDeliveryDashboard } from '@/features/delivery/use-delivery-dashboard';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DeliveryDashboard() {
  const {
    activeTask,
    availableTasks,
    isAvailable,
    loading,
    refreshing,
    actionLoading,
    logout,
    user,
    loadData,
    handleRefresh,
    toggleAvailability,
    acceptTask,
    updateStatus,
  } = useDeliveryDashboard();
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BrutalTelemetryStrip
        left={`PILOT // ${user?.fullName?.toUpperCase() || 'COURIER 01'}`}
        right={isAvailable ? 'BEACON: BROADCASTING' : 'BEACON: STANDBY'}
      />

      {/* Courier Cockpit Bar */}
      <View style={styles.cockpitBar}>
        <View style={styles.pilotInfo}>
          <View style={styles.pilotAvatar}>
            <MaterialIcons name="two-wheeler" size={18} color={BrutalColors.black} />
          </View>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.pilotName}>{user?.fullName || 'Courier Partner'}</Text>
              <BrutalBadge label="PRO RIDER" variant="yellow" />
            </View>
            <Text style={styles.pilotCorridor}>ZONE // INDIRANAGAR HYPERLOCAL</Text>
          </View>
        </View>

        <View style={styles.cockpitActions}>
          <TouchableOpacity
            onPress={toggleAvailability}
            activeOpacity={0.8}
            style={[styles.dutyToggle, isAvailable ? styles.dutyOn : styles.dutyOff]}
          >
            <View
              style={[
                styles.dutyDot,
                { backgroundColor: isAvailable ? BrutalColors.terminalGreen : '#999' },
              ]}
            />
            <Text style={styles.dutyText}>{isAvailable ? 'ON DUTY' : 'OFF DUTY'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={logout} activeOpacity={0.8} style={styles.logoutBtn}>
            <MaterialIcons name="logout" size={16} color={BrutalColors.urgentRed} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={BrutalColors.black}
          />
        }
      >
        {loading ? (
          <View style={styles.centerLoading}>
            <ActivityIndicator size="large" color={BrutalColors.black} />
            <Text style={styles.loadingText}>SYNCHRONIZING DISPATCH RADAR...</Text>
          </View>
        ) : activeTask ? (
          <View style={{ gap: 16 }}>
            {/* Active Flight Mission Card */}
            <BrutalCard bg={BrutalColors.white} style={styles.missionCard}>
              <View style={styles.missionHeader}>
                <View>
                  <Text style={styles.missionTag}>ACTIVE MISSION PROTOCOL</Text>
                  <Text style={styles.missionOrderId}>
                    ORDER #{activeTask.orderId?.slice(-8).toUpperCase()}
                  </Text>
                </View>
                <BrutalBadge
                  label={activeTask.status}
                  variant={activeTask.status === 'IN_TRANSIT' ? 'green' : 'yellow'}
                />
              </View>

              {/* Waypoint Architecture */}
              <View style={styles.waypointsContainer}>
                {/* Waypoint 1: Store Pickup */}
                <View style={styles.waypointBox}>
                  <View style={styles.waypointHeader}>
                    <View style={styles.waypointStepBadge}>
                      <Text style={styles.waypointStepNum}>1</Text>
                    </View>
                    <Text style={styles.waypointType}>COLLECT AT STORE HUB</Text>
                  </View>
                  <Text style={styles.waypointTitle}>
                    {activeTask.order?.store?.name || 'Local Store Hub'}
                  </Text>
                  <Text style={styles.waypointSub}>
                    {activeTask.order?.store?.address || 'Indiranagar 100ft Hub'}
                  </Text>
                </View>

                {/* Corridor Arrow */}
                <View style={styles.corridorConnector}>
                  <View style={styles.connectorLine} />
                  <Ionicons name="arrow-down" size={16} color={BrutalColors.black} />
                  <View style={styles.connectorLine} />
                </View>

                {/* Waypoint 2: Customer Doorstep */}
                <View style={[styles.waypointBox, { backgroundColor: '#FFFDF0' }]}>
                  <View style={styles.waypointHeader}>
                    <View
                      style={[styles.waypointStepBadge, { backgroundColor: BrutalColors.yellow }]}
                    >
                      <Text style={styles.waypointStepNum}>2</Text>
                    </View>
                    <Text style={styles.waypointType}>DELIVER TO DOORSTEP</Text>
                  </View>
                  <Text style={styles.waypointTitle}>
                    {activeTask.order?.deliveryAddress || 'Customer Doorstep'}
                  </Text>
                  <Text style={styles.waypointSub}>
                    Recipient: {activeTask.order?.user?.fullName || 'Omnidrop Customer'}
                  </Text>
                </View>
              </View>

              {/* Embedded GPS Radar Map View */}
              <View style={styles.mapContainer}>
                <MapView
                  style={{ flex: 1 }}
                  initialRegion={{
                    latitude: Number(activeTask.pickupLat) || 12.9716,
                    longitude: Number(activeTask.pickupLng) || 77.5946,
                    latitudeDelta: 0.025,
                    longitudeDelta: 0.025,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: Number(activeTask.pickupLat) || 12.9716,
                      longitude: Number(activeTask.pickupLng) || 77.5946,
                    }}
                    title="Pickup Hub"
                    description={activeTask.order?.store?.name}
                  />
                  {activeTask.dropLat && (
                    <Marker
                      coordinate={{
                        latitude: Number(activeTask.dropLat),
                        longitude: Number(activeTask.dropLng),
                      }}
                      title="Customer Doorstep"
                      pinColor="green"
                    />
                  )}
                </MapView>
                <View style={styles.mapTelemetryOverlay}>
                  <Text style={styles.mapTelemetryText}>● GPS TRACKING BROADCAST ACTIVE</Text>
                </View>
              </View>

              {/* Action Pipeline */}
              <View style={{ marginTop: 16 }}>
                {activeTask.status === 'ACCEPTED' && (
                  <BrutalButton
                    title="CONFIRM STORE PICKUP →"
                    onPress={() => updateStatus(activeTask.id, 'PICKED_UP')}
                    loading={actionLoading}
                    variant="yellow"
                    size="lg"
                    fullWidth
                  />
                )}
                {activeTask.status === 'PICKED_UP' && (
                  <BrutalButton
                    title="START FLIGHT & GPS BROADCAST →"
                    onPress={() => updateStatus(activeTask.id, 'IN_TRANSIT')}
                    loading={actionLoading}
                    variant="black"
                    size="lg"
                    fullWidth
                  />
                )}
                {activeTask.status === 'IN_TRANSIT' && (
                  <BrutalButton
                    title="DOORSTEP DELIVERED ✓"
                    onPress={() => updateStatus(activeTask.id, 'DELIVERED')}
                    loading={actionLoading}
                    variant="green"
                    size="lg"
                    fullWidth
                  />
                )}
              </View>
            </BrutalCard>
          </View>
        ) : (
          <View style={{ gap: 16 }}>
            {/* Courier Shift Performance Matrix */}
            <View style={styles.metricsRow}>
              <View style={[styles.metricCard, { backgroundColor: BrutalColors.yellow }]}>
                <Text style={styles.metricLabel}>TODAY'S BOUNTY</Text>
                <Text style={styles.metricVal}>₹680</Text>
                <Text style={styles.metricSub}>+ ₹120 SURGE</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: BrutalColors.white }]}>
                <Text style={styles.metricLabel}>COMPLETED</Text>
                <Text style={styles.metricVal}>14</Text>
                <Text style={styles.metricSub}>MISSIONS</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: BrutalColors.terminalGreen }]}>
                <Text style={styles.metricLabel}>SLA RATING</Text>
                <Text style={styles.metricVal}>99.4%</Text>
                <Text style={styles.metricSub}>&lt; 14 MIN AVG</Text>
              </View>
            </View>

            {/* Radar Standby Hero */}
            <BrutalCard bg={isAvailable ? '#F4FBF7' : BrutalColors.white} style={styles.idleHero}>
              <View style={styles.radarIconWrap}>
                <Ionicons
                  name={isAvailable ? 'radio-outline' : 'power-outline'}
                  size={36}
                  color={BrutalColors.black}
                />
              </View>
              <Text style={styles.idleTitle}>
                {isAvailable
                  ? 'RADAR ACTIVE · LISTENING ON CORRIDOR'
                  : 'OFF DUTY · PILOT ON STANDBY'}
              </Text>
              <Text style={styles.idleSub}>
                {isAvailable
                  ? 'Continuous scan active across 38 micro-hubs in Indiranagar. Instant push when order is bagged.'
                  : 'Toggle to "ON DUTY" in the cockpit bar above to connect to the automated dispatch mesh.'}
              </Text>
            </BrutalCard>

            {/* Radar Available Missions */}
            <View>
              <View style={styles.sectionHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={styles.sectionTitle}>
                    AVAILABLE MISSIONS ({availableTasks.length})
                  </Text>
                  <BrutalBadge label="REAL-TIME" variant="yellow" />
                </View>
                <TouchableOpacity onPress={loadData} activeOpacity={0.7} style={styles.refreshBtn}>
                  <Ionicons name="reload" size={14} color={BrutalColors.black} />
                  <Text style={styles.refreshBtnText}>SYNC</Text>
                </TouchableOpacity>
              </View>

              {availableTasks.length === 0 ? (
                <BrutalCard bg={BrutalColors.white} style={styles.emptyCard}>
                  <Ionicons name="file-tray-outline" size={32} color="#888" />
                  <Text style={styles.emptyTitle}>ALL FLIGHT MISSIONS ASSIGNED</Text>
                  <Text style={styles.emptySub}>
                    New orders are assigned automatically every 10–30 seconds.
                  </Text>
                </BrutalCard>
              ) : (
                <View style={{ gap: 12 }}>
                  {availableTasks.map((task) => {
                    const bounty = Math.round((task.order?.deliveryFee || 45) * 0.85);
                    return (
                      <BrutalCard key={task.id} bg={BrutalColors.white} style={styles.taskCard}>
                        <View style={styles.taskHeader}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.taskStore}>
                              {task.order?.store?.name || 'Local Store Hub'}
                            </Text>
                            <Text style={styles.taskSub}>
                              {task.order?.store?.address || 'Indiranagar corridor'}
                            </Text>
                          </View>
                          <BrutalBadge label={`+₹${bounty} BOUNTY`} variant="green" />
                        </View>

                        <View style={styles.taskDivider} />

                        <View style={styles.taskDetails}>
                          <View style={styles.detailRow}>
                            <Ionicons
                              name="location-outline"
                              size={14}
                              color={BrutalColors.black}
                            />
                            <Text style={styles.detailText} numberOfLines={1}>
                              DROP: {task.order?.deliveryAddress || 'Neighborhood Corridor'}
                            </Text>
                          </View>
                          <View style={styles.detailRow}>
                            <Ionicons name="cube-outline" size={14} color="#666" />
                            <Text style={styles.detailSub}>
                              PKG #{task.orderId?.slice(-6).toUpperCase()} · VALUE ₹
                              {task.order?.total || 0}
                            </Text>
                          </View>
                        </View>

                        <BrutalButton
                          title="ACCEPT & LOCK MISSION →"
                          onPress={() => acceptTask(task.id)}
                          loading={actionLoading}
                          variant="yellow"
                          size="md"
                          fullWidth
                        />
                      </BrutalCard>
                    );
                  })}
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
