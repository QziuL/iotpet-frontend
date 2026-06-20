import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, Shadows } from '@/theme';
import { AppHeader, ProfileAvatar, CardInfo, EmptyState, LoadingState, GlowIconButton } from '@/components';
import { usePets } from '@/hooks/usePets';
import { usePetsStore } from '@/store/pets.store';
import type { Pet } from '@/types/pet.types';

const SPECIES_EMOJI: Record<string, string> = {
  dog: '🐶',
  cat: '🐱',
  bird: '🐦',
  rabbit: '🐰',
  other: '🐾',
};

function PetCard({
  pet,
  isActive,
  onPress,
}: {
  pet: Pet;
  isActive: boolean;
  onPress: () => void;
}) {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <CardInfo style={[styles.card, isActive && styles.cardActive] as any}>
        {/* Active badge */}
        {isActive && (
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>Ativo</Text>
          </View>
        )}

        {/* Main row */}
        <View style={styles.cardRow}>
          <ProfileAvatar
            uri={pet.avatarUrl}
            name={pet.name}
            size={64}
            online={!!pet.deviceId}
          />

          <View style={styles.petInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.petName}>{pet.name}</Text>
              <Text style={styles.speciesEmoji}>
                {SPECIES_EMOJI[pet.species] ?? '🐾'}
              </Text>
            </View>
            <Text style={styles.petBreed}>
              {pet.breed} ·{' '}
              {pet.species === 'dog'
                ? 'Cachorro'
                : pet.species === 'cat'
                ? 'Gato'
                : 'Animal'}
            </Text>
            <View style={styles.deviceRow}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: pet.deviceId
                      ? Colors.state.success
                      : Colors.state.offline,
                  },
                ]}
              />
              <Text style={styles.deviceText}>
                {pet.deviceId ? 'Dispositivo vinculado' : 'Sem dispositivo'}
              </Text>
            </View>
          </View>

          <Ionicons name="chevron-forward" size={18} color={Colors.text.tertiary} />
        </View>

        {/* Quick actions row */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push('/map' as any)}
          >
            <Ionicons name="location-outline" size={16} color={Colors.primary.light} />
            <Text style={styles.actionText}>Mapa</Text>
          </TouchableOpacity>
          <View style={styles.actionDivider} />
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push(`/geofencing/${pet.id}` as any)}
          >
            <Ionicons name="scan-outline" size={16} color={Colors.primary.light} />
            <Text style={styles.actionText}>Cerca</Text>
          </TouchableOpacity>
          <View style={styles.actionDivider} />
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push(`/pets/${pet.id}` as any)}
          >
            <Ionicons name="person-outline" size={16} color={Colors.primary.light} />
            <Text style={styles.actionText}>Perfil</Text>
          </TouchableOpacity>
        </View>
      </CardInfo>
    </TouchableOpacity>
  );
}

export default function PetsListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: pets, isLoading } = usePets();
  const { activePetId, setActivePet } = usePetsStore();

  if (isLoading) return <LoadingState />;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader
        title="Meus Pets"
        showBack
        subtitle={
          pets?.length
            ? `${pets.length} pet${pets.length > 1 ? 's' : ''} cadastrado${pets.length > 1 ? 's' : ''}`
            : undefined
        }
        rightSlot={
          <GlowIconButton
            icon={<Ionicons name="add" size={22} color={Colors.white} />}
            size={38}
            onPress={() => router.push('/pets/new' as any)}
          />
        }
      />

      {!pets?.length ? (
        <EmptyState
          icon="paw-outline"
          title="Nenhum pet cadastrado"
          description="Adicione seu primeiro pet para começar a rastreá-lo."
          action={
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => router.push('/pets/new' as any)}
            >
              <Ionicons name="add-circle-outline" size={18} color={Colors.primary.light} />
              <Text style={styles.addBtnText}>Adicionar pet</Text>
            </TouchableOpacity>
          }
        />
      ) : (
        <FlatList
          data={pets}
          keyExtractor={p => p.id}
          renderItem={({ item }) => (
            <PetCard
              pet={item}
              isActive={item.id === activePetId}
              onPress={() => {
                setActivePet(item.id);
                router.push(`/pets/${item.id}` as any);
              }}
            />
          )}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: Spacing[3] }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  list: { paddingHorizontal: Spacing[5], paddingTop: Spacing[4] },

  card: { gap: Spacing[4] },
  cardActive: {
    borderColor: Colors.border.primary,
    ...Shadows.glowPrimary,
  },

  activeBadge: {
    position: 'absolute',
    top: Spacing[3],
    right: Spacing[3],
    backgroundColor: Colors.primary.subtle,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.primary.default,
    paddingVertical: 2,
    paddingHorizontal: Spacing[2] + 2,
  },
  activeBadgeText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: Colors.primary.light,
  },

  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[4],
  },
  petInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
  petName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.text.primary,
  },
  speciesEmoji: { fontSize: 18 },
  petBreed: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1] + 2,
    marginTop: Spacing[1] + 2,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  deviceText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border.subtle,
    paddingTop: Spacing[3],
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[1] + 2,
    paddingVertical: Spacing[2],
  },
  actionText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.primary.light,
  },
  actionDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.border.default,
  },

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[5],
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary.subtle,
    borderWidth: 1,
    borderColor: Colors.primary.default,
  },
  addBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.primary.light,
  },
});
