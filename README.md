# Iteration 2

**Access Url**: 
https://iteration2.dt22dakt0bfii.amplifyapp.com 

We can see here the RASER landing page.  

Notice the top right of the window shows the actors access menu (Published Rubrics, Rubric designer, Journal editor). The site as we see it right now is that of an admin that has access to all actor roles.  

Here you have three buttons to Design a rubric, manage a journal, and Browse Published rubrics.  

1. **Duplicate Rubric**: 
Clicking each button drops the user to its respective page starting with Design a rubric where we see the same page from iteration 1, a new feature is the duplicate rubric use case where selecting the "duplicate" button adds a rubric of duplicated title to the rubrics table and drops the user into the rubric editor page also from iteration 1. 

2. **Deprecate rubric**: 
Now we can look at our next use case which is deprecate rubric. Only a designer can deprecate a rubric on the designer page, the published rubrics page is read-only. A rubric cannot be deprecated until an alternative published rubric is available to take its place. The rubric will then say at the top of the page that it has been deprecated and provide a public link to view the replacement. The rubrics table will also show a red "deprecated" status on the row with the deprecated rubric. 

3. **Register Journal**: 

This concludes our Rubric editor use cases. The next use cases pertain to the Journal editor. Starting by selecting the editor button on the top right of the page to arrive at the Journals window. To register a journal, input a Journal name into the text field before selecting the blue Journal button.  

4. **Show Journal Dashboard** 

This registers your journal and displays it on the journal dashboard with a green "active" 
label which is the next applicable use case. 

5. **Withdraw Journal** 
To withdraw a journal, simply select the white 'Withdraw' button underneath the register journal button. The page will ask for your confirmation, where you can confirm or cancel your journal withdraw. When confirmed, the journal can no longer be edited and is flagged with a red 'withdrawn' label. 

6. **Create Issue** 
On the journal editor page, you have the option to adopt a published rubric to the journal. Below the rubric adoption, you will find the next use case: Create issue. To create an issue for the journal there is the option to set the volume number and the issue number. Once configured, select the blue "create issue" to the right and then an issue will appear below with the set Volume and Number. 

7. **Delete Issue** 
The next use case would then be delete issue, which is the white button that appears to the right of the volume and number of the newly created issue. Select the 'Delete issue button to delete the issue. 

8. **Add Paper** 
When an issue has been created, below the new issue the user sees the next applicable use case: Add Paper. The user can input a paper title and author name in the text fields as well as a rubric to connect to the paper. The paper cannot be created until each field has been completed.  

9. **Withdraw Paper** 
When a paper is created, to the right of its details that were inputted is a white "withdraw" button as the last use case. Select the "withdraw" button to withdraw the paper. 

**AI Use Acknowledgement**: 
Claude Code was integrated in the editing and reviewing stages of iteration 2 to ensure code correctness and overall application functionality in areas such as frontend styling as well

# Iteration 1

**Frontend**:
Next.js app hosted on AWS Amplify (replaces the S3 bucket; approved by the professor), deployed from the StructureUpdate branch.

**Access URL**:
https://structureupdate.d25a6k92bpurow.amplifyapp.com/

For this iteration we apply 9 use cases: 

1. **List Rubric**:  The first of which is List rubrics, the Rubrics page displays a table of rubrics to the Rubric Designer shown here with two sample rubrics, their titles, their status, how many questions they contain, their maximum score, their publish date if published, and if the rubric status is a draft,  

2. **Delete Rubric**: to the far right of the rubrics table there will be a delete button which, when pressed, prompts the Rubric Designer if they wish to delete the selected rubric. Select “OK” to delete the rubric, or “Cancel” to omit the action.  

3. **View rubric**: If a rubric has already been published. The Rubric Designer may select the hyperlinked rubric as prompted in the banner above. The view rubric page is labelled with the selected Rubric’s title, and a published tag to the right of the title. The scrollable page contains the scoring, publish date, and various sample rubric data for this demonstration with sections, questions within the sections, ratings, explanations, and if a section is empty or without questions it is noted on the page for the Rubric designer to see. This sample data is derived from the project spec in the Group Project Provisional start PowerPoint.  The rubric designer may return to the list rubrics page by scrolling to the top of the page and selecting the ‘<==All Rubrics’ button at the top left of the page. 

4. **Create rubric**: To create a rubric, the Rubric Designer must first enter a rubric name into the ‘New Rubric name’ text field, then select the blue ‘Create Rubric Button’ [LiveDemoRubric] To arrive at the rubric creator page. Note the grey ‘draft’ tag next to the new rubric title. Here the rubric designer has the option to change the rubric name and set a quality threshold with interactive increase or decrease arrows. Save the Settings before continuing. 

5. **Add Question**: The section layout for the rubric designer displays the ‘No questions yet’ label until the rubric designer selects ‘Add question,’ where the Rubric Designer can in put a question, and then the rating explanations for ratings 5 to 1. Save the question to solidify changes or cancel before continuing. Clicking add question in another section before saving will cancel the question draft and the changes will not be saved. Saving the question will allow the rubric designer to add another question to the section.  

6. **Delete Question**: When the question has been saved, the Rubric Designer will see the option to edit or delete the question, select the delete question and the question will be deleted.  

7. **Edit Question**: Selecting the Edit question button will open the same interface as add question, where the rubric designer has the ability to edit the question data previously input. 

8. **Edit rubric**: If the draft rubric is not ready to publish, the rubric designer may ensure all the data they intend to save has saved, and then select the ‘<==All Rubrics’ button at the top left of the page to return to the list rubrics view. To continue editing the unpublished rubric, as prompted by the yellow banner above, select the hyperlinked title of the rubric with the ‘draft’ status tag. Note that if a rubric has already been published, it may not be edited. 

9. **Publish rubric**: When the rubric designer finishes creating the new rubric, the blue publish rubric button is selected, the ‘published’ tag will now appear next to the rubric title at the top of the page. Select the ‘<==All Rubrics’ button at the top left of the page to return to the list rubrics page. 

**Usability Considerations**: 
It is important to note that each question in a rubric is worth a maximum score of 5. Therefore, the low and high thresholds that the rubric designer can set must account for this maximum score. For instance, if a rubric has 3 questions, the maximum score is by default 15. The high and low thresholds cannot not exceed 15 as an error message "The high threshold exceeds the maximum score" will be shown. 

Furthermore, before a draft rubric can be formally published, all rating explanations (for each question in the rubric) must be filled out, otherwise an error message 

**AI Use Acknowledgement**: 
Claude Code was integrated in the editing and reviewing stages of iteration 1 to ensure code correctness and overall application functionality in areas such as frontend styling as well as the backend setup involving 9 AWS Lambda functions. 

**Back end**: 9 AWS Lambda functions (Node.js 22) behind API Gateway, connected to an RDS MySQL database. Deployed with AWS CDK application/. 
API base URL: https://q9iq2yw6ji.execute-api.us-east-1.amazonaws.com/prod/
Try it: https://q9iq2yw6ji.execute-api.us-east-1.amazonaws.com/prod/rubric/list

Every route returns 200 on success and 400 with an error message, for example when deleting a published rubric.
config.mjs (database credentials) is not in the repo, for security.


**Status**: Connecting it to the API above is planned for Iteration 2.