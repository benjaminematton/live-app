// app/feed.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

/** Mock type for your upcoming experiences. Replace with actual fields. */
type ExperienceResponse = {
  id: number;
  title: string;
  photoUrl?: string;
};

/** Mock type for your user object in PostResponse */
type UserResponse = {
  id: number;
  username: string;
  profilePictureUrl?: string;
};

/** PostResponse from the new GET /feed/following endpoint */
type PostResponse = {
  id: number;
  user: UserResponse;
  createdAt: string; // LocalDateTime as a string
  caption: string;
  imageUrl: string[]; // array of image URLs
  isPublic: boolean;
  location?: string;
  likeCount: number;
  commentCount: number;
};

export default function Feed() {
  const router = useRouter();

  // ------------------ UPCOMING EVENTS ------------------
  const [upcomingExperiences, setUpcomingExperiences] = useState<ExperienceResponse[]>([]);
  const [isLoadingUpcoming, setIsLoadingUpcoming] = useState<boolean>(true);

  // Simulate calling GET /upcoming
  useEffect(() => {
    Alert.alert("Info", "Pretend we called GET /upcoming for upcoming events!");
    setTimeout(() => {
      // Toggle these lines to test scenarios
      // setUpcomingExperiences([]); // no upcoming experiences
      setUpcomingExperiences([
        { id: 1, title: "Trip to the Mountains", photoUrl: "" },
        { id: 2, title: "Beach Cleanup", photoUrl: "" },
      ]);
      setIsLoadingUpcoming(false);
    }, 1500);
  }, []);

  // ------------------ FEED POSTS ------------------
  const [feedPosts, setFeedPosts] = useState<PostResponse[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState<boolean>(true);

  // Simulate calling GET /feed/following
  useEffect(() => {
    Alert.alert("Info", "Pretend we called GET /feed/following for user posts!");
    setTimeout(() => {
      // Example posts
      setFeedPosts([
        {
          id: 101,
          user: {
            id: 2001,
            username: "Luke Willson",
            profilePictureUrl: "", // or actual URL
          },
          createdAt: "2024-12-28T19:03:00", // Dec 28, 2024 at 7:03 PM
          caption: "276/500 \nJust did a big ride!",
          imageUrl: [
            // multiple images
            "https://via.placeholder.com/400x200.png?text=Ride1",
            "https://via.placeholder.com/400x200.png?text=Ride2",
          ],
          isPublic: true,
          location: "",
          likeCount: 76,
          commentCount: 12,
        },
        {
          id: 102,
          user: {
            id: 2002,
            username: "Jane Doe",
          },
          createdAt: "2025-01-02T10:00:00",
          caption: "New year, new goals!",
          imageUrl: ["https://via.placeholder.com/400x200.png?text=NYGoal"],
          isPublic: true,
          location: "Tucson, Arizona",
          likeCount: 23,
          commentCount: 5,
        },
      ]);
      setIsLoadingFeed(false);
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      {/* Example top bar */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Home</Text>
      </View>

      {/* =================== UPCOMING EVENTS SECTION =================== */}
      <View style={styles.upcomingEventsBox}>
        <View style={styles.upcomingHeader}>
          <Text style={styles.upcomingTitle}>Upcoming events</Text>
          <TouchableOpacity
            onPress={() => {
              Alert.alert("See more", "Would push to /profile!");
              // router.push("/profile");
            }}
          >
            <Text style={styles.seeMore}>See more</Text>
          </TouchableOpacity>
        </View>

        {isLoadingUpcoming ? (
          <Text style={{ color: "#fff", marginTop: 8 }}>Loading...</Text>
        ) : upcomingExperiences.length === 0 ? (
          <TouchableOpacity
            style={styles.dummyPhotoContainer}
            onPress={() => {
              Alert.alert("Create Experience", "Would push to /create-experience!");
              // router.push("/create-experience");
            }}
          >
            <Image
              style={styles.dummyPhoto}
              source={require("../../assets/images/photo2.png")}
              resizeMode="cover"
            />
            <Text style={styles.dummyText}>
              No upcoming events. Tap to create one!
            </Text>
          </TouchableOpacity>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.experiencesScroll}
          >
            {upcomingExperiences.map((exp) => (
              <TouchableOpacity
                key={exp.id}
                style={styles.experienceCard}
                onPress={() => {
                  Alert.alert(
                    "Upcoming Experience Detail",
                    `Would push to /experience/${exp.id}!`
                  );
                  // router.push(`/experience/${exp.id}`);
                }}
              >
                <Image
                  style={styles.experiencePhoto}
                  source={
                    exp.photoUrl
                      ? { uri: exp.photoUrl }
                      : require("../../assets/images/photo2.png")
                  }
                  resizeMode="cover"
                />
                <Text style={styles.experienceTitle}>{exp.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* =================== FEED POSTS =================== */}
      <ScrollView style={{ flex: 1 }}>
        {isLoadingFeed ? (
          <Text style={{ color: "#fff", margin: 12 }}>Loading feed...</Text>
        ) : feedPosts.map((post) => (
          <View key={post.id} style={styles.feedItem}>
            {/* USER INFO ROW */}
            <View style={styles.userRow}>
              {/* Profile Picture */}
              <Image
                style={styles.profilePic}
                source={
                  post.user.profilePictureUrl
                    ? { uri: post.user.profilePictureUrl }
                    : require("../../assets/images/photo2.png")
                }
              />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.username}>{post.user.username}</Text>
                {/* Format date/time string as needed */}
                <Text style={styles.postDate}>
                  {formatDateTime(post.createdAt)}
                </Text>
                {post.location ? (
                  <Text style={styles.postLocation}>{post.location}</Text>
                ) : null}
              </View>
              {/* 3-dot menu icon */}
              <TouchableOpacity
                onPress={() =>
                  Alert.alert("Menu", "Could open a post menu here!")
                }
              >
                <Text style={{ color: "#888" }}>•••</Text>
              </TouchableOpacity>
            </View>

            {/* CAPTION */}
            {Boolean(post.caption) && (
              <Text style={styles.caption}>{post.caption}</Text>
            )}

            {/* IMAGES: horizontally or in a row */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.postImagesScroll}
            >
              {post.imageUrl.map((imgUrl, idx) => (
                <Image
                  key={idx}
                  style={styles.postImage}
                  source={{ uri: imgUrl }}
                />
              ))}
            </ScrollView>

            {/* LIKE / COMMENT / SHARE ROW */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => Alert.alert("Like", `Liked post ${post.id}`)}
              >
                <Text style={{ color: "#fff" }}>👍</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() =>
                  Alert.alert("Comments", `Would push to comment screen for post ${post.id}`)
                }
              >
                <Text style={{ color: "#fff" }}>💬</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => Alert.alert("Share", "Share logic here!")}
              >
                <Text style={{ color: "#fff" }}>↗️</Text>
              </TouchableOpacity>
            </View>

            {/* LIKE / COMMENT counts */}
            <Text style={styles.countText}>
              {post.likeCount} likes • {post.commentCount} comments
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

/** Helper to format date/time strings */
function formatDateTime(dtString: string): string {
  // Quick example
  const date = new Date(dtString);
  return date.toLocaleString(); // e.g. "12/28/2024, 7:03:00 PM"
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 12,
    backgroundColor: "#000",
  },
  topBarTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  // ============ UPCOMING EVENTS ============

  upcomingEventsBox: {
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  upcomingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  seeMore: {
    fontSize: 14,
    color: "#f15a24",
  },
  dummyPhotoContainer: {
    marginTop: 8,
    alignItems: "center",
  },
  dummyPhoto: {
    width: 200,
    height: 100,
    borderRadius: 6,
    marginBottom: 6,
  },
  dummyText: {
    color: "#fff",
  },
  experiencesScroll: {
    marginTop: 8,
  },
  experienceCard: {
    width: 140,
    marginRight: 12,
  },
  experiencePhoto: {
    width: "100%",
    height: 80,
    borderRadius: 6,
    marginBottom: 4,
    backgroundColor: "#333",
  },
  experienceTitle: {
    color: "#fff",
    fontWeight: "500",
    textAlign: "center",
  },

  // ============ FEED POSTS ============

  feedItem: {
    backgroundColor: "#222",
    margin: 12,
    padding: 12,
    borderRadius: 6,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#444",
  },
  username: {
    color: "#fff",
    fontWeight: "bold",
  },
  postDate: {
    color: "#888",
    fontSize: 12,
  },
  postLocation: {
    color: "#ccc",
    fontSize: 12,
  },
  caption: {
    color: "#fff",
    marginBottom: 6,
  },
  postImagesScroll: {
    marginBottom: 6,
  },
  postImage: {
    width: 200,
    height: 120,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: "#333",
  },
  actionRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  actionBtn: {
    marginRight: 16,
  },
  countText: {
    color: "#999",
    fontSize: 12,
  },
});
