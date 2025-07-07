import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native"

interface CancelBookingModalProps {
  visible: boolean
  onClose: () => void
  onCancel: () => void
  bookingNumber: string
  cancellationDate: string
}

export default function CancelBookingModal({
  visible,
  onClose,
  onCancel,
  bookingNumber,
  cancellationDate,
}: CancelBookingModalProps) {
  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Cancel your booking</Text>

          <Text style={styles.confirmationText}>Are you going to cancel your booking {bookingNumber}?</Text>

          <Text style={styles.policyText}>
            Free cancellation until {cancellationDate}. The room rate will not be refunded if cancelled after{" "}
            {cancellationDate}.
          </Text>

          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel your booking</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.goBackButton} onPress={onClose}>
            <Text style={styles.goBackButtonText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  confirmationText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  policyText: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 24,
    lineHeight: 20,
  },
  cancelButton: {
    backgroundColor: "#00a67e",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  goBackButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  goBackButtonText: {
    color: "#00a67e",
    fontSize: 16,
  },
})
