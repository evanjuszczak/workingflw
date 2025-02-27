// Check if the script is already injected
if (!window.depopFollowManager) {
  // Create a namespace for our extension
  window.depopFollowManager = {
    isFollowing: false,
    isUnfollowing: false,
    
    // Helper function to sleep
    sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    // Smooth scroll function
    smoothScroll: async function() {
      try {
        const scrollHeight = document.documentElement.scrollHeight;
        const viewportHeight = window.innerHeight;
        const scrollStep = viewportHeight / 4; // Scroll 1/4 viewport height at a time
        
        let currentScroll = window.scrollY;
        while (currentScroll < scrollHeight - viewportHeight) {
          if (!this.isFollowing && !this.isUnfollowing) break;
          
          currentScroll += scrollStep;
          window.scrollTo({
            top: currentScroll,
            behavior: 'smooth'
          });
          await this.sleep(1000); // Wait 1 second between scrolls
        }
      } catch (error) {
        console.error('Scroll error:', error);
      }
    },

    // Function to handle following
    handleFollow: async function() {
      try {
        const maxIterations = 1000; // Number of times to refresh and follow
        for (let iteration = 0; iteration < maxIterations; iteration++) {
          let followCount = 0;
          let totalFlwsCount = 0;
          while (this.isFollowing) {
            const followButtons = document.querySelectorAll('button._buttonWrapper_n6h1p_5._padding--sm_n6h1p_60._colorStyles--blue_n6h1p_100');
            let foundButtons = false;
            
            for (const button of followButtons) {
              if (!this.isFollowing) break;
              
              const buttonText = button.querySelector('span._text_bevez_41');
              if (buttonText && buttonText.textContent === 'Follow') {
                foundButtons = true;
                button.click();
                followCount++;
                totalFlwsCount++;
                console.log(`Followed User (${followCount}/3)`);
                
                // If we've reached 5 follows, click a random username element
                if (followCount >= 3 || followCount >= followButtons.length -1) {
                  await this.sleep(2000); // Give the program 2 seconds to load here
                  console.log(`--------------------------------`);
                  if(followCount >= 3){
                    console.log('Reached 3 follows - Clicking a random user and refreshing...');
                  } else if (followCount >= followButtons.length -1){
                  console.log('Not enough people to follow - Clicking a random user and refreshing...');
                  }
                  console.log(`Total Follows Since Start: ${totalFlwsCount}`);
                  console.log(`--------------------------------`);
                  const usernameElements = document.querySelectorAll('p._text_bevez_41._shared_bevez_6._bold_bevez_47');
                  // filter
                  const validUsernames = Array.from(usernameElements).filter(element => {
                    const isPriceElement = element.classList.contains('styles_price__H8qdh') || 
                                          element.textContent.trim().startsWith('$'); // Check if it starts with a dollar sign
                  
                    const isMenuItem = element.classList.contains('_normal_bevez_51') || 
                                      element.classList.contains('styles_categoryListItemText__UUeyQ') || 
                                      element.classList.contains('sc-eDnWTT NavigationV2-styles__MenuListItemButton-sc-839ae779-2 cAWeBm cyugSW') ||
                                      element.classList.contains('NavigationV2-styles__MenuListItem-sc-839ae779-3 fKglOt') ||
                                      element.classList.contains('_text_bevez_41 _shared_bevez_6 _normal_bevez_51 _button_bevez_72 styles_menuListItemButton__hpXd9') ||
                                      element.classList.contains('sc-eDnWTT NavigationV2-styles__MenuListItemButton-sc-839ae779-2 cAWeBm fKdMoi') ||
                                      element.classList.contains('styles__HeaderContainer-sc-b6db0aa4-1 kzmiFR') ||
                                      element.classList.contains('styles_menuListItem__SYKnY') || 
                                      element.classList.contains('styles_hoverContainer__2cs5G') ||
                                      element.classList.contains('styles_categoryListContainer__IXnHC styles_navCategoryListWide__eTk5R') || 
                                      element.classList.contains('_h3_bevez_33 _shared_bevez_6 styles_categoryListTitle__QqBG_') || 
                                      element.classList.contains('styles_categoryListItemsContainer__largeList__lzgGx') || 
                                      element.classList.contains('styles_categoryListitem__Fct3o"') || 
                                      element.classList.contains('cstyles_unstyledLink__DsttP styles_categoryListLink__g2_tb') || 
                                      element.classList.contains('_text_bevez_41 _shared_bevez_6 _normal_bevez_51 styles_categoryListItemText__UUeyQ') || 
                                      element.classList.contains('styles_menuListItem__SYKnY') || 
                                      element.classList.contains('_text_bevez_41 _shared_bevez_6 _bold_bevez_47 styles_categoryListFooter__XsvqQ') ||
                                      element.classList.contains('styles_sellerName__GcDDz') || 
                                      element.classList.contains('p._text_bevez_41._shared_bevez_6._bold_bevez_47.styles_categoryListFooter__XsvqQ') ||
                                      element.classList.contains('_text_bevez_41._shared_bevez_6._bold_bevez_47.styles_categoryListFooter__XsvqQ') ||
                                      element.classList.contains('styles_categoryListFooter__XsvqQ') ||
                                      element.classList.contains('styles_activeHeadingText__CvvdK');
                  
                    return !isPriceElement && !isMenuItem && element.textContent.trim() !== "Street Clothing XYZ"; // Add more conditions as needed
                  });
                  if (validUsernames.length > 0) {
                    //console.log(validUsernames)
                    //console.log(validUsernames.length);
                    const randomIndex = Math.floor(Math.random() * validUsernames.length);
                    console.log(`Selected User: ${validUsernames[randomIndex].textContent}`); // Log the selected user
                    await this.sleep(2000); // Wait for 2 seconds so i can read the debug msg
                    validUsernames[randomIndex].click(); // Click a random username element
                    // Wait for 30 seconds on the new profile, maybe will stop api detection
                    console.log('30 second wait to load profile / api coming here');
                    await this.sleep(30000); 
                    // Click the 'Show following' button
                    const followButton = document.querySelector('button.styles_followCount__UzSsn');
                    if (followButton) {
                      followButton.click(); // Click the follow count button
                      console.log('one minute wait to load followers / api coming here');
                      await this.sleep(60000); // Wait for 1 minute before resuming follows
                      console.log('one minute passed');
                    }
                    followCount = 0; // Reset counter after navigation
                    console.log('Resuming follows with reset counter');
                    break; // Break the current loop to start fresh with new buttons
                  } else {
                    console.log('No valid usernames found. Navigating to a direct link.');
                    window.location.href = 'https://www.depop.com/corsethaul/'; // Redirect to a specific URL
                    // Alternatively, you could use history.back() to go back to the previous page
                    // history.back();
                  }
                } else {
                  await this.sleep(6000); // 7 second delay between follows
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Follow error:(probably already following)', error);
        this.isFollowing = false;
      }
    },

    // Function to handle unfollowing
    handleUnfollow: async function() {
      try {
        const maxIterationsUnfollow = 700;
        for (let iterationUnfollow = 0; iterationUnfollow < maxIterationsUnfollow; iterationUnfollow++){
        let unfollowCount = 0;
        let totalUnfollowCount = 0;
        while (this.isUnfollowing) {
          const followingButtons = document.querySelectorAll('button[data-testid="followingButton"]');
          let foundButtonsUnfollow = false;
          
          for (const button of followingButtons) {
            if (!this.isUnfollowing) break;
            const buttonText = button.querySelector('span').textContent;
            console.log(`Button text: ${buttonText}`);
            if (buttonText === 'Following') {
              foundButtonsUnfollow = true;
              button.click();
              unfollowCount = unfollowCount + 1;
              console.log('Unfollowed User');
              await this.sleep(5000); // 6.5 second delay between unfollows
              if(unfollowCount>=5){
                  console.log(`--------------------------------`);
                  console.log('Reached 10 unfollows - Refreshing...');
                  console.log(`Total Follows Since Start: ${totalUnfollowCount}`);
                  console.log(`--------------------------------`);
                  await this.sleep(2000); // Give the program 2 seconds to load here
                  location.reload(); // Refresh the page
                  console.log("Page refreshed, extension should keep loading.")
                  console.log("6 second wait here.")
                  await this.sleep(6000); // Give the program 6 seconds to load here
                  const newUnfollowingPage = button.querySelector('span._text_bevez_41');
                    if (newUnfollowingPage && newUnfollowingPage.textContent === 'Following') {
                      newUnfollowingPage.click();
                      // Wait for 30 seconds on the new profile, maybe will stop api detection
                      console.log('one minute wait to load followers / api coming here');
                      await this.sleep(60000); // Wait for 1 minute before resuming follows
                      console.log('one minute passed');
                    }
                  unfollowCount = 0;
                  console.log("Resuming unfollows with the fresh counter");
                  break;
              }
            } else {
              await this.sleep(5000); // 5 second delay between follows
            }
          }
          if (!foundButtonsUnfollow){
            console.log("No buttons found/no users to unfollow")
            this.isUnfollowing = false; // stops process
          }
        }
      }
      } catch (error) {
        console.error('Unfollow error:', error);
        this.isUnfollowing = false;
      }
    }
  };

  // Listen for messages from popup
  var countformsg = 0;

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    countformsg++;
    if (countformsg == 1) {
      console.log('This application follows the Depop guidelines and API restrictions as of 2/23/2025.');
      console.log('Made with love by @ev');
    }
    console.log('Toggling:', request);

    
    if (request.action === 'toggleFollow') {
      window.depopFollowManager.isFollowing = request.value;
      window.depopFollowManager.isUnfollowing = false;
      if (window.depopFollowManager.isFollowing) {
        window.depopFollowManager.handleFollow().catch(console.error);
      }
      sendResponse({ success: true });
    } else if (request.action === 'toggleUnfollow') {
      window.depopFollowManager.isUnfollowing = request.value;
      //window.depopFollowManager.isUnfollowing = false;
      if (window.depopFollowManager.isUnfollowing) {
        window.depopFollowManager.handleUnfollow().catch(console.error);
      }
      sendResponse({ success: true });
    }
    
    return true; // Required to use sendResponse asynchronously
  });
} 

