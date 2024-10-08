# Usage

<!-- start usage -->
```yaml
- name: Checkout repository
  uses: actions/checkout@v2

- name: '<Your Feature Under Test>' # Example: REST API Feature Testing or Database Feature Testing 
  uses: Testing-By-Specification/testspec-action@v0.0.4-beta.1
  with:
    version: '0.0.4'         # The release version to download and run
    plugin_type: 'directory'  # Specify 'directory' or 'file' depending on the input
    plugin_path: '/src/test/resources/features/database'  # Path to the directory (e.g., './features/core') or file (e.g., './features/core/Command.feature')
```
### Optional
If you need to specify a Java version before running TestSpec, otherwise Java 11 will be used by default:
```yaml
- name: Set up JDK 17
  uses: actions/setup-java@v3
  with:
    distribution: 'temurin'
    java-version: '17'

- name: REST API Feature Test
  uses: Testing-By-Specification/testspec-action@v0.0.4-beta.1
  with:
    version: '0.0.4'
    plugin_type: 'directory'
    plugin_path: '/src/test/resources/features/rest'

```
<!-- end usage -->

Traditionally, in large organizations software systems often tested manually by dedicated QA teams.
While it has some merits, this approach suffers from serious limitations.
The main limitation is - inability to speed up testing phase after a certain point.
As the application grows larger, it requires more time to perform manual testing on every release cycle.
To keep the quality of the product up, regression testing is required before each release.

One obvious solution to this situation is to hire more manual QA testers.
Beside the fact that it's expensive, after the team grows to a certain point,
you'll start seeing diminishing returns on each added QA team member.
Even with more QAs hired, large applications still take a considerable amount of time to test,
which prolongs release cycles.

Another solution to this problem is automation of functional testing.
Here comes the dilemma though: test automation _is_ software development.
But your manual QA testers - as a rule - are not.  
Teams that came to a decision to automate, implement it differently:
* some try to train QAs to become programmers
* others hire programmers to do automation

This is where Test-spec can help. Test-spec enabled QAs to automate functional test scenarios _without becoming "full-blown" programmers_.
Of course, it could also be used by developers, as it simply saves time that developers would spend otherwise on implementing Cucumber glue code.


**Functionality**

Test-spec makes testing easier by implementing commonly used operation by encapsulating them into Cucumber steps.
Eventually test-spec will do:
* web testing:
    * entering values into input fields,
    * clicking on web page element,
    * checking web page content
* REST/SOAP
    * making REST/SOAP calls
    * analyzing REST/SOAP responses
    * running REST mocks with stubs
* querying DB (to validate outcome of some operation)
* working with files
    * check content
    * create a files based on a template
* sending JMS/Kafka messages
* execute external scripts
* execute user code as an extension of the framework,
* while still allowing users to create their own custom steps