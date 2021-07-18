import cheerio from "cheerio-without-node-native";
import * as React from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Linking,
} from "react-native";

const { width, height } = Dimensions.get("window");

function extractHostname(url) {
  var hostname;
  if (url?.indexOf("//") > -1) {
    hostname = url?.split("/")[2];
  } else {
    hostname = url?.split("/")[0];
  }
  hostname = hostname?.split(":")[0];
  hostname = hostname?.split("?")[0];
  return hostname?.replace("www.", "");
}

const sample = [
  "https://tribune.com.pk/story/2310940/pakistan-sees-crypto-boom",
  "https://www.thenews.com.pk/latest/865493-daily-covid-19-report-2783-test-positive-for-coronavirus-in-pakistan",
  "https://www.dawn.com/news/1635491",
  "https://tribune.com.pk/story/2310856/extremely-unfair-to-blame-pakistan-for-afghan-unrest",
  "https://www.bbc.com/news/world-asia-57877239",
  "https://www.dawn.com/news/1635301",
  "https://www.bbc.co.uk/sport/football/57836300",
  "https://www.bavarianfootballworks.com/2021/7/17/22581051/koln-vs-bayern-munich-lineups-live-stream-how-to-watch-international-friendly-updates-highlights",
  "https://www.geo.tv/latest/360535-iggy-azalea-going-on-hiatus-in-music-career-will-be-away-a-few-years",
  "https://www.thenews.com.pk/latest/865060-sajal-aly-atif-aslams-rafta-rafta-music-video-release-date-confirmed",
  "https://www.reuters.com/world/europe/music-banned-greeces-mykonos-new-covid-19-restrictions-2021-07-17/",
  "https://www.theguardian.com/tv-and-radio/2021/jul/14/an-american-riddle-the-black-music-trailblazer-who-died-white-harry-pace",
  "https://www.nbcnews.com/media/netflix-eyes-foray-video-games-rcna1425",
  "https://www.katymagazineonline.com/post/musicians-spread-the-love-of-music-at-a-local-katy-nonprofit",
  "https://www.npr.org/2021/07/13/1015630514/new-music-friday-the-top-8-albums-out-on-july-16",
  "https://www.al.com/news/huntsville/2021/07/city-of-huntsville-hiring-music-officer-with-salary-up-to-89211.html",
  "https://www.wric.com/business/record-store-day-brings-lines-of-customers-to-local-shops-music-means-so-much-to-people/",
];

const App = () => {
  const [data, setData] = React.useState(sample);
  const [loading, setLoading] = React.useState(false);

  const fetchArticles = async () => {
    let state = [];
    setLoading(true);
    for (const i of sample) {
      const response = await fetch(i); // fetch page
      const htmlString = await response.text(); // get response text
      const $ = cheerio.load(htmlString); // parse HTML string
      let local = { title: "", image: "", url: "", description: "" };
      for (const i of Object.keys(local)) {
        local[i] = $(`meta[property="og:${i}"]`).attr("content")?.trim();
      }
      state.push(local);
    }
    setData(state);
    setLoading(false);
  };
  React.useEffect(() => {
    fetchArticles();
  }, []);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity style={styles.view} activeOpacity={1} onPress={async () => await Linking.openURL(item.url)}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text numberOfLines={2} style={styles.desc}>
        {item.description}
      </Text>
      <Text numberOfLines={2} style={styles.website}>
        {extractHostname(item.url)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator animating size="large" />
      ) : (
        <FlatList
          data={data}
          ListHeaderComponent={<Text style={styles.header}>{"react-native-fetch-news"}</Text>}
          keyExtractor={(item, index) => item + index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainerStyle}
        />
      )}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  header: { fontSize: 30, marginHorizontal: 10, fontWeight: "bold" },
  contentContainerStyle: { paddingVertical: 80 },
  website: {
    fontWeight: "400",
    fontSize: 12,
    color: "gray",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  desc: {
    fontWeight: "400",
    fontSize: 15,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  title: {
    fontWeight: "700",
    fontSize: 17,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  image: {
    width: width * 0.95,
    height: height * 0.25,
    borderTopLeftRadius: 15,
  },
  view: {
    borderWidth: 1,
    borderColor: "#d3d3d3",
    borderRadius: 15,
    flexGrow: 0,
    marginHorizontal: 5,
    marginVertical: 10,
    width: width * 0.95,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});
