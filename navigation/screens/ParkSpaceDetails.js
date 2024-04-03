import React, {useEffect, useLayoutEffect, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
  Dimensions,
} from "react-native";
import useLoadingWithinComponent from "../customHooks/useLoadingWithinComponent";
import axios from "axios";
import backendUrls from "../connections/backendUrls";
import LoadingModal from "../components/LoadingModal";
import Icon from "react-native-vector-icons/FontAwesome";

const screenWidth = Dimensions.get("window").width;
const CARD_WIDTH = screenWidth * 0.8;
const CARD_MARGIN = 15; // Updated for consistency

const {getParkAreaDetailsURL} = backendUrls;

const getFormattedAverageRating = (totalRating, totalNumberOfRatings) => {
  if (!totalRating || !totalNumberOfRatings || totalNumberOfRatings === 0) {
    return "Rating not available";
  }
  const averageRating = totalRating / totalNumberOfRatings;
  return `${Math.round(averageRating * 100) / 100} (${totalNumberOfRatings})`;
};

export default function ParkSpaceDetails({navigation, route}) {
  const {space} = route.params;
  const {isLoading, startLoading, stopLoading} = useLoadingWithinComponent();
  const [parkAreaDetails, setParkAreaDetails] = useState(null);

  useEffect(() => {
    const fetchParkAreaDetails = async () => {
      startLoading();
      try {
        const response = await axios.post(getParkAreaDetailsURL, {
          parkAreaId: space._id,
        });
        if (response.data?.success && response.data?.parkAreaDetails) {
          setParkAreaDetails(response.data.parkAreaDetails);
        } else {
          Alert.alert(
            "Error",
            response.data.message || "Failed to fetch park area details"
          );
        }
      } catch (error) {
        Alert.alert(
          "Error",
          "Cannot fetch park area details due to a network or server issue"
        );
      } finally {
        stopLoading();
      }
    };
    fetchParkAreaDetails();
  }, [space._id]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: space.parkAreaName || "Park Details",
      headerTitleStyle: {
        fontWeight: "bold",
      },
    });
  }, [navigation, space.parkAreaName]);

  const renderFacility = ({item}) => (
    <View style={styles.facilityContainer}>
      <Icon name="check" size={16} color="#4CAF50" />
      <Text style={styles.facilityText}>{item}</Text>
    </View>
  );

  const renderBookingInfo = (bookings, title) => (
    <>
      <Text style={styles.sectionTitle}>{title}</Text>
      {bookings.length > 0 ? (
        bookings.map(booking => (
          <View key={booking._id} style={styles.bookingInfo}>
            <Text style={styles.bookingText}>
              Vehicle: {booking.vehicleId.vehicleNumber}
            </Text>
            <Text style={styles.bookingText}>Owner: {booking.userId.name}</Text>
            {title === "Past Bookings" && (
              <Text style={styles.bookingText}>
                Checked Out: {booking.checkOutTime}
              </Text>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.noBookings}>No {title.toLowerCase()}.</Text>
      )}
    </>
  );

  const renderReview = ({item}) => (
    <View style={styles.reviewCard}>
      <Text style={styles.reviewText}>{item.review}</Text>
      <Text style={styles.reviewerName}>- {item.userName}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <LoadingModal isLoading={isLoading} />
      {parkAreaDetails && (
        <>
          <View style={styles.detailCard}>
            <Text style={styles.detailText}>
              {parkAreaDetails.address}, {parkAreaDetails.city},{" "}
              {parkAreaDetails.state}
            </Text>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={20} color="#FFD700" />
              <Text style={styles.ratingText}>
                {getFormattedAverageRating(
                  parkAreaDetails.rating.totalRating,
                  parkAreaDetails.rating.totalNumberOfRatings
                )}
              </Text>
            </View>
            <View style={styles.facilitiesContainer}>
              <FlatList
                horizontal
                data={parkAreaDetails.facilitiesAvailable}
                renderItem={renderFacility}
                keyExtractor={(item, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <Text style={styles.rateAndRevenueText}>
              Today's Rate Per Hour: ₹ {parkAreaDetails.ratePerHour}/hr
            </Text>
            <Text style={styles.rateAndRevenueText}>
              Today's Revenue: ₹{parkAreaDetails.revenue.todays}
            </Text>
          </View>
          <Text style={styles.userReviewsTitle}>User Reviews</Text>
          <FlatList
            data={parkAreaDetails.reviews}
            renderItem={renderReview}
            keyExtractor={(item, index) => index.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
            decelerationRate="fast"
            contentContainerStyle={styles.reviewsContainer}
            ListEmptyComponent={
              <Text style={{marginLeft: 15, color: "#666"}}>
                No reviews available
              </Text>
            }
          />

          <View style={styles.bookingsSection}>
            {renderBookingInfo(
              parkAreaDetails.activeBookings || [],
              "Active Bookings"
            )}
            {renderBookingInfo(
              parkAreaDetails.pastBookings || [],
              "Past Bookings"
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

// Updated styles for a more uniform look and proper margins
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  detailCard: {
    margin: 15,
    padding: 15,
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
  },
  detailText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#444",
  },
  facilitiesContainer: {
    marginBottom: 20,
  },
  facilityContainer: {
    flexDirection: "row",
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 5,
    padding: 5,
    marginRight: 10, // Added margin to the right for spacing between items
  },
  facilityText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#4CAF50",
  },
  rateAndRevenueText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  userReviewsTitle: {
    fontSize: 18,
    marginVertical: 15,
    color: "#333",
    fontWeight: "bold",
    marginLeft: 15,
  },
  reviewsContainer: {
    paddingLeft: 15,
    marginBottom: 20,
  },
  reviewCard: {
    width: CARD_WIDTH,
    backgroundColor: "#F0F0F0",
    padding: 15,
    marginRight: CARD_MARGIN,
    borderRadius: 8,
  },
  reviewText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#444",
  },
  bookingsSection: {
    margin: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  bookingInfo: {
    marginBottom: 10,
    padding: 15,
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
  },
  bookingText: {
    fontSize: 16,
    color: "#555",
  },
  noBookings: {
    marginBottom: 5,
    fontSize: 16,
    color: "#666",
  },
});
